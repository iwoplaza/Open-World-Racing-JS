var shaders = new Array(0);
var currentUsedShader = undefined;

function initShaders() {
    createShader("default", function(program) {
        program.normalAttribute = gl.getAttribLocation(program, "aNormal");
        gl.enableVertexAttribArray(program.normalAttribute);
        gl.uniform4f(gl.getUniformLocation(program, "uGlobalColor"), 1, 1, 1, 1);
    });

    createShader("blocks", function(program) {
        program.normalAttribute = gl.getAttribLocation(program, "aNormal");
        gl.enableVertexAttribArray(program.normalAttribute);
        gl.uniform4f(gl.getUniformLocation(program, "uGlobalColor"), 1, 1, 1, 1);
    });
    
    createShader("car", function(program) {
        program.normalAttribute = gl.getAttribLocation(program, "aNormal");
        gl.enableVertexAttribArray(program.normalAttribute);
        gl.uniform4f(gl.getUniformLocation(program, "uGlobalColor"), 1, 1, 1, 1);
        gl.uniform3f(gl.getUniformLocation(program, "uBodyColor"), 0, 1, 1);
    });
    
    useShader("default");
}

function createShader(p_name, p_callback) {
    var fragmentShaderScript = document.getElementById(p_name+"-fs");
    var vertexShaderScript = document.getElementById(p_name+"-vs");
    if (!fragmentShaderScript || !vertexShaderScript) {
        return null;
    }
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    
    //Compiling the Fragment Shader
    
    var str = "";
    var k = fragmentShaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    gl.shaderSource(fragmentShader, str);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader));
        return null;
    }
    
    //Compiling the Vertex Shader
    
    var str = "";
    var k = vertexShaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    
    gl.shaderSource(vertexShader, str);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader));
        return null;
    }
    
    //Creaing a Shader Program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

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
    
    shaders[p_name] = {
        name: p_name,
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        program: shaderProgram
    };
}

function getShader(p_name) {
    return shaders[p_name];
}

function useShader(p_name) {
    currentUsedShader = p_name;
    gl.useProgram(getShader(p_name).program);
}

function getCurrentShader() {
    return getShader(currentUsedShader);
}