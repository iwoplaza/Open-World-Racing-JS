var ShaderManager = {
    shaders: new Array(0),
    current: null,
    
    //This function is called after the resources have been loaded
    postInit: function() {
        this.create("default", function(program) {
            program.normalAttribute = gl.getAttribLocation(program, "aNormal");
            gl.enableVertexAttribArray(program.normalAttribute);
            gl.uniform4f(gl.getUniformLocation(program, "uGlobalColor"), 1, 1, 1, 1);
        });

        this.create("blocks", function(program) {
            program.normalAttribute = gl.getAttribLocation(program, "aNormal");
            gl.enableVertexAttribArray(program.normalAttribute);
            gl.uniform4f(gl.getUniformLocation(program, "uGlobalColor"), 1, 1, 1, 1);
        });

        this.create("car", function(program) {
            program.normalAttribute = gl.getAttribLocation(program, "aNormal");
            gl.enableVertexAttribArray(program.normalAttribute);
            gl.uniform4f(gl.getUniformLocation(program, "uGlobalColor"), 1, 1, 1, 1);
            gl.uniform3f(gl.getUniformLocation(program, "uBodyColor"), 0, 1, 1);
        });

        this.use("default");
    },
    
    loadResource: function(resourceManager, name) {
        this.shaders[name] = {
            name: name
        };
        
        resourceManager.addTask();
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
                var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                
                gl.shaderSource(vertexShader, xmlhttp.responseText);
                gl.compileShader(vertexShader);

                if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                    alert(gl.getShaderInfoLog(vertexShader));
                    return null;
                }
                
                gl.shaderSource(fragmentShader, xmlhttp.responseText);
                gl.compileShader(fragmentShader);

                if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                    alert(gl.getShaderInfoLog(fragmentShader));
                    return null;
                }
                
                ShaderManager.shaders[name].vertexShader = vertexShader;
                ShaderManager.shaders[name].fragmentShader = fragmentShader;
                
                //Creaing a Shader Program
                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, this.shaders[name].vertexShader);
                gl.attachShader(shaderProgram, this.shaders[name].fragmentShader);
                gl.linkProgram(shaderProgram);

                if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                    alert("Could not initialise shaders");
                }
                this.shaders[name].program = shaderProgram;
                
                resourceManager.releaseTask();
            }
        }
        xmlhttp.open("GET","res/shaders/"+name+".json", true);
        xmlhttp.send();
    },
    
    create: function(p_name, p_callback) {
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        //gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        //glDisableVertexAttribArray
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

        shaderProgram.enableTexturesUniform = gl.getUniformLocation(shaderProgram, "uEnableTextures");

        gl.useProgram(shaderProgram);
        if(p_callback != undefined) p_callback(shaderProgram);

        this.shaders[p_name] = {
            name: p_name,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            program: shaderProgram
        };
    },
    
    get: function(p_name) {
        return this.shaders[p_name];
    },
    
    use: function(p_name) {
        this.current = this.get(p_name);
        gl.useProgram(this.current.program);
    },
    
    getCurrent: function() {
        return this.current;
    },
    
    getUniformLocation: function(p_name) {
        return gl.getUniformLocation(this.current.program, p_name);
    },
    
    setUniform1i(p_name, p_x) { gl.uniform1i(ShaderManager.getUniformLocation(p_name), p_x) },
    setUniform1f(p_name, p_x) { gl.uniform1f(ShaderManager.getUniformLocation(p_name), p_x) },
    setUniform2i(p_name, p_x, p_y) { gl.uniform2i(ShaderManager.getUniformLocation(p_name), p_x, p_y) },
    setUniform2f(p_name, p_x, p_y) { gl.uniform2f(ShaderManager.getUniformLocation(p_name), p_x, p_y) },
    setUniform3i(p_name, p_x, p_y, p_z) { gl.uniform3i(ShaderManager.getUniformLocation(p_name), p_x, p_y, p_z) },
    setUniform3f(p_name, p_x, p_y, p_z) { gl.uniform3f(ShaderManager.getUniformLocation(p_name), p_x, p_y, p_z) }
};