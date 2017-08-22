var spritesheets = new Array(0);

function initSpritesheets() {
    //createSpritesheet("misc_playPrompt", "res/img/misc/playPrompt.png", 256, 64);
}

function createSpritesheet(p_name, p_filepath, p_spriteWidth, p_spriteHeight) {
    spritesheets[p_name] = {
        textureId: -1,
        sheetWidth: 0,
        sheetHeight: 0,
        spriteWidth: p_spriteWidth,
        spriteHeight: p_spriteHeight,
        renderObject: new Mesh(),
        
        drawSprite: function(p_cx, p_environmental) {
            var p_cy = p_cx[1];
            p_cx = p_cx[0];
            
            if(p_environmental == undefined) p_environmental = false;
            
            useShader(p_environmental ? "environment-sprite" : "sprite");
            enableTextures();
            gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.textureId);
			gl.uniform1i(gl.getUniformLocation(getCurrentShader().program, "uSampler"), 0);
            if(p_environmental) LightMapManager.bindToShader();
            
            var ax = p_cx/(this.sheetWidth/this.spriteWidth);
            var ay = p_cy/(this.sheetHeight/this.spriteHeight);
            /*drawTexturedRect(this.spriteWidth, this.spriteHeight, p_offsetX, p_offsetY, [1, 1, 1, 1], [
                [ax, ay+ah],
                [ax+aw, ay+ah],
                [ax+aw, ay],
                [ax, ay]
            ]);*/
            gl.uniform2f(gl.getUniformLocation(getCurrentShader().program, "uSprite"), ax, ay);
            
            this.renderObject.draw();
        }
    };
    
	ResourceManager.registerResourceToLoad();
	var fontImage = new Image();
	fontImage.onload = function() {
        spritesheets[p_name].textureId = gl.createTexture();
        spritesheets[p_name].sheetWidth = this.width;
        spritesheets[p_name].sheetHeight = this.height;
        
        spritesheets[p_name].renderObject.fillOut(
            [
                0, 0,
                spritesheets[p_name].spriteWidth, 0,
                0, spritesheets[p_name].spriteHeight,
                spritesheets[p_name].spriteWidth, 0,
                0, spritesheets[p_name].spriteHeight,
                spritesheets[p_name].spriteWidth, spritesheets[p_name].spriteHeight,
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
                0, spritesheets[p_name].spriteHeight/spritesheets[p_name].sheetHeight,
                spritesheets[p_name].spriteWidth/spritesheets[p_name].sheetWidth, spritesheets[p_name].spriteHeight/spritesheets[p_name].sheetHeight,
                0, 0,
                spritesheets[p_name].spriteWidth/spritesheets[p_name].sheetWidth, spritesheets[p_name].spriteHeight/spritesheets[p_name].sheetHeight,
                0, 0,
                spritesheets[p_name].spriteWidth/spritesheets[p_name].sheetWidth, 0,
            ]
        );
        
        TextureManager.handleTextureLoaded(fontImage, spritesheets[p_name].textureId);
		ResourceManager.checkOutResourceLoaded();
	}
	fontImage.src = p_filepath;
}