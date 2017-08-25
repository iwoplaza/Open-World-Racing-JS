var ShaderManager = {
    shaders: new Array(0),
    current: null,
	MAX_LIGHTS: 10,
    
    //This function is called after the resources have been loaded
    postInit: function() {
        this.create("default", function(program) {
            program.normalAttribute = gl.getAttribLocation(program, "aNormal");
            gl.enableVertexAttribArray(program.normalAttribute);
            gl.uniform4f(gl.getUniformLocation(program, "uGlobalColor"), 1, 1, 1, 1);
        });

        this.use("default");
    },
    
    loadResource: function(resourceManager, name) {
        if(this.shaders[name] != undefined)
            return;
        
        this.shaders[name] = {
            name: name,
			attributes: []
        };
        
        resourceManager.addTask();
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
				ShaderManager.shaders[name].sourceCode = xmlhttp.responseText;
                ShaderManager.compile(resourceManager, name);
            }
        }
        xmlhttp.open("GET", ResourceManager.prototype.RESOURCE_PATH+name, true);
        xmlhttp.send();
    },
	
	compile: function(resourceManager, name) {
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		
		var vertexShaderSource = "precision mediump float;\nprecision mediump int;";
		var fragmentShaderSource = "precision mediump float;\nprecision mediump int;";
		var mode = 0;
		var lines = this.shaders[name].sourceCode.split('\n');
		for(var i in lines) {
			var line = lines[i];
			if(line.beginsWith('[')) {
				if(line.substring(1).beginsWith('VERTEX')) {
					mode = 1;
				}else if(line.substring(1).beginsWith('FRAGMENT')) {
					mode = 2;
				}
				lines.splice(i, 1);
				i--;
			}else{
				if(mode == 1) {
                    if(line.beginsWith('in '))
                        line = line.replace(/in /, "attribute ");
                    else if(line.beginsWith('out '))
                        line = line.replace(/out /, "varying ");
					vertexShaderSource += line + '\n';
                }else if(mode == 2) {
                    if(line.beginsWith('in '))
                        line = line.replace(/in /, "varying ");
					fragmentShaderSource += line + '\n';
                }
			}
		}
        
        
        console.log(vertexShaderSource);
        
		gl.shaderSource(vertexShader, vertexShaderSource);
		gl.compileShader(vertexShader);

		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(vertexShader));
			return null;
		}

		gl.shaderSource(fragmentShader, fragmentShaderSource);
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
		
        let linesForAnalize = (vertexShaderSource + fragmentShaderSource).split('\n');
		for(var i in linesForAnalize) {
			var line = linesForAnalize[i];
			if(line.beginsWith('attribute')) {
				var variableName = line.split(' ')[2].slice(0, -2);
				var attributeName = variableName.charAt(1).toLowerCase() + variableName.slice(2);
				console.log("Attribute", "Var:"+variableName+", Att:"+attributeName);
				this.shaders[name].attributes[attributeName] = gl.getAttribLocation(shaderProgram, variableName);
				gl.enableVertexAttribArray(this.shaders[name].attributes[attributeName]);
			}
		}
		
		resourceManager.releaseTask();
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
	
	hasAttribute: function(name) {
		return this.current.attributes[name] != undefined;
	},
	
	getAttribute: function(name) {
		return this.current.attributes[name];
	},
	
	vertexAttribPointer: function(attribute, size, type, flag, x, y) {
		gl.vertexAttribPointer(this.getAttribute(attribute), size, type, flag, x, y);
	},
    
    populateLightingData: function(lights) {
        console.log("Populating lighting data");
        
        for(let name in this.shaders) {
            this.use(name);
            this.setUniform1i("uLightCount", lights.length);
            for(var i = 0; i < lights.length && i < this.MAX_LIGHTS; i++) {
                this.setUniform3f("uLight["+i+"].source", lights[i].gameObject.location.x, lights[i].gameObject.location.y, lights[i].gameObject.location.z);
                this.setUniform3f("uLight["+i+"].diffuseColor", lights[i].diffuseColor[0], lights[i].diffuseColor[1], lights[i].diffuseColor[2]);
                this.setUniform3f("uLight["+i+"].ambientColor", lights[i].ambientColor[0], lights[i].ambientColor[1], lights[i].ambientColor[2]);
                this.setUniform1f("uLight["+i+"].range", lights[i].range);
            }
        }
    },
    
    alterLightingData: function(i, light) {
        for(let name in this.shaders) {
            this.use(name);
            this.setUniform3f("uLight["+i+"].source", lights[i].gameObject.location.x, lights[i].gameObject.location.y, lights[i].gameObject.location.z);
            this.setUniform4f("uLight["+i+"].diffuseColor", lights[i].diffuseColor[0], lights[i].diffuseColor[1], lights[i].diffuseColor[2]);
            this.setUniform4f("uLight["+i+"].ambientColor", lights[i].ambientColor[0], lights[i].ambientColor[1], lights[i].ambientColor[2]);
            this.setUniform1f("uLight["+i+"].range", lights[i].range);
        }
    },
    
    setUniform1i(p_name, p_x) { gl.uniform1i(ShaderManager.getUniformLocation(p_name), p_x) },
    setUniform1f(p_name, p_x) { gl.uniform1f(ShaderManager.getUniformLocation(p_name), p_x) },
    setUniform2i(p_name, p_x, p_y) { gl.uniform2i(ShaderManager.getUniformLocation(p_name), p_x, p_y) },
    setUniform2f(p_name, p_x, p_y) { gl.uniform2f(ShaderManager.getUniformLocation(p_name), p_x, p_y) },
    setUniform3i(p_name, p_x, p_y, p_z) { gl.uniform3i(ShaderManager.getUniformLocation(p_name), p_x, p_y, p_z) },
    setUniform3f(p_name, p_x, p_y, p_z) { gl.uniform3f(ShaderManager.getUniformLocation(p_name), p_x, p_y, p_z) },
    setUniform4i(p_name, p_x, p_y, p_z, p_w) { gl.uniform4i(ShaderManager.getUniformLocation(p_name), p_x, p_y, p_z, p_w) },
    setUniform4f(p_name, p_x, p_y, p_z, p_w) { gl.uniform4f(ShaderManager.getUniformLocation(p_name), p_x, p_y, p_z, p_w) }
};