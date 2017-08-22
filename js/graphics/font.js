var Font = {
    registry: new Array(0),
    
    init: function() {
        this.registerFont("normal");
        this.registerFont("slick");
        this.registerFont("normal_big");
    },
    
    registerFont: function(_name) {
        this.registry[_name] = {
            name: _name,
            textureId: -1,
            spaceWidth: 0,
            frameWidth: 0,
            frameHeight: 0,
            sheetWidth: 0,
            sheetHeight: 0,
            charData: new Array(),

            getTextWidth: function(_text, _scale, _charSeperation) {
                _scale = _scale || 1.0;
                _charSeperation = _charSeperation || 0.0;

                var cursorLoc = 0;
                var codingStyle = false;
                for(var c = 0; c < _text.length; c++){
                    if(_text[c] == '#'){
                        codingStyle = !codingStyle;
                        codedStyle = "";
                    }else if(codingStyle){
                    }else if(_text[c] == ' '){
                        cursorLoc+=this.spaceWidth;
                    }else{
                        if(this.charData[_text[c]] != undefined){
                            cursorLoc+=this.charData[_text[c]].width+_charSeperation;
                        }
                    }
                }

                cursorLoc*=_scale;

                return cursorLoc;
            }
        };

        ResourceManager.registerResourceToLoad();

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.status==200 && xmlhttp.readyState==4){    
                var words = xmlhttp.responseText.split('\n');
                var charIdx = 0;
                for(var i = 0; i < words.length; i++){
                    var entries = words[i].split(' ');
                    if(entries[0] == "SPACE"){
                        Font.registry[_name].spaceWidth = parseInt(entries[1]);
                    }else if(entries[0] == "FRAME_WIDTH"){
                        Font.registry[_name].frameWidth = parseInt(entries[1]);
                    }else if(entries[0] == "FRAME_HEIGHT"){
                        Font.registry[_name].frameHeight = parseInt(entries[1]);
                    }else if(entries[0] == "SHEET_WIDTH"){
                        Font.registry[_name].sheetWidth = parseInt(entries[1]);
                    }else if(entries[0] == "SHEET_HEIGHT"){
                        Font.registry[_name].sheetHeight = parseInt(entries[1]);
                    }else{
                        Font.registry[_name].charData[entries[0]] = {
                            char: entries[0],
                            width: parseInt(entries[1]),
                            offsetY: parseInt(entries[2]),
                            renderObject: new Mesh(),
                        };

                        var u0 = (charIdx%16)*Font.registry[_name].frameWidth/Font.registry[_name].sheetWidth;
                        var v0 = (Math.floor(charIdx/16)+1)*Font.registry[_name].frameHeight/Font.registry[_name].sheetHeight;
                        var u1 = ((charIdx)%16+1)*Font.registry[_name].frameWidth/Font.registry[_name].sheetWidth;
                        var v1 = (Math.floor(charIdx/16))*Font.registry[_name].frameHeight/Font.registry[_name].sheetHeight;

                        Font.registry[_name].charData[entries[0]].renderObject.fillOut(
                            [
                                0, 0, 0,
                                Font.registry[_name].frameWidth, 0, 0,
                                0, Font.registry[_name].frameHeight, 0,
                                Font.registry[_name].frameWidth, 0, 0,
                                Font.registry[_name].frameWidth, Font.registry[_name].frameHeight, 0,
                                0, Font.registry[_name].frameHeight, 0
                            ],
                            [
                                1, 1, 1, 1,
                                1, 1, 1, 1,
                                1, 1, 1, 1,
                                1, 1, 1, 1,
                                1, 1, 1, 1,
                                1, 1, 1, 1
                            ],
                            [
                                u0,v0,
                                u1,v0,
                                u0,v1,
                                u1,v0,
                                u1,v1,
                                u0,v1
                            ]
                        );

                        charIdx++;
                    }
                }

                ResourceManager.checkOutResourceLoaded();
            }
        }
        xmlhttp.open("GET","res/font/"+_name+".txt",true);
        xmlhttp.send();

        ResourceManager.registerResourceToLoad();
        var fontImage = new Image();
        fontImage.onload = function() {
            Font.registry[_name].textureId = gl.createTexture();
            TextureManager.handleTextureLoaded(fontImage, Font.registry[_name].textureId);
            ResourceManager.checkOutResourceLoaded();
        }
        fontImage.src = "res/font/"+_name+".png";
    },
    
    drawWorldText: function(_text, _name, _loc, _scale, _alignment /*0 - left, 1 - center, 2 - right*/, _charSeperation) {
        if(_loc == undefined) _loc = [0, 0];

        GLHelper.resetToWorldMatrix();
        GLHelper.translate([_loc[0], _loc[1], 0]);

        this.drawText(_text, _name, _loc, _scale, _alignment, _charSeperation);
    },

    drawGuiText: function(_text, _name, _loc, _scale, _alignment /*0 - left, 1 - center, 2 - right*/, _charSeperation) {
        if(_loc == undefined) _loc = [0, 0];

        GLHelper.resetToGuiMatrix();
        GLHelper.translate([_loc[0], _loc[1], 0]);

        this.drawText(_text, _name, _loc, _scale, _alignment, _charSeperation);
    },

    drawText: function(_text, _name, _loc, _scale, _alignment /*0 - left, 1 - center, 2 - right*/, _charSeperation) {
        _scale = _scale || 1.0;
        _charSeperation = _charSeperation || 0.0;
        _alignment = _alignment || 0;

        useShader("font");
        TextureManager.enableTextures();

        var textOriginX = _alignment == 1 ? -this.registry[_name].getTextWidth(_text, _scale, _charSeperation)/2 : _alignment == 2 ? -this.registry[_name].getTextWidth(_text, _scale, _charSeperation) : 0;
        GLHelper.translate([textOriginX, 0, 0]);
        GLHelper.scale([_scale, _scale, _scale]);

        var cursorLoc = 0;
        var framesPerRow = Math.floor(this.registry[_name].frameWidth/this.registry[_name].sheetWidth);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.registry[_name].textureId);
        gl.uniform1i(gl.getUniformLocation(getCurrentShader().program, "uSampler"), 0);

        var codingStyle = false;
        var codedStyle = "";
        var color = [1,1,1,1];
        gl.uniform4f(gl.getUniformLocation(getCurrentShader().program, "uFontColor"), color[0],color[1],color[2],color[3]);
        for(var c = 0; c < _text.length; c++){
            if(_text[c] == '#'){
                codingStyle = !codingStyle;
                color = [0,1,0,1];
                if(codingStyle == false){
                    var newStyle = getChatFormatting(codedStyle);
                    if(newStyle != undefined){
                        color = newStyle;
                        gl.uniform4f(gl.getUniformLocation(getCurrentShader().program, "uFontColor"), color[0],color[1],color[2],color[3]);
                    }
                }
                codedStyle = "";
            }else if(codingStyle){
                codedStyle+=_text[c];
            }else if(_text[c] == ' '){
                GLHelper.translate([this.registry[_name].spaceWidth, 0, 0]);
            }else if(this.registry[_name].charData[_text[c]] != undefined){
                var character = this.registry[_name].charData[_text[c]];
                character.renderObject.draw();
                GLHelper.translate( [character.width+_charSeperation, 0, 0]);
            }
        }
    },

    getFont: function(_name) {
        return this.registry[_name];
    },

    getChatFormatting: function(text) {
        if(text=="c"){
            return [1,0,0,1];
        }else if(text=="k"){
            return [1,1,0.4,1];
        }else if(text=="a"){
            return [1,0.4,0.7,1];
        }else if(text=="0"){
            return [1,1,1,1];
        }

        return undefined;
    }
};