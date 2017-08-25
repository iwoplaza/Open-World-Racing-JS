function Mesh() {
    this.positionBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
    this.textureCoordBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();
    this.boneIndiciesBuffer = undefined;
    this.boneWeightsBuffer = undefined;
    
    this.draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        ShaderManager.vertexAttribPointer('vertexPosition', this.positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        ShaderManager.vertexAttribPointer('vertexColor', this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        if(TextureManager.areTexturesEnabled()){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.enableVertexAttribArray(ShaderManager.getAttribute('textureCoord'));
            ShaderManager.vertexAttribPointer('textureCoord', this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }else{
            gl.disableVertexAttribArray(ShaderManager.getAttribute('textureCoord'));
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        ShaderManager.vertexAttribPointer('normal', this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        GLHelper.publishMatrixUniforms();
		ShaderManager.setUniform1i('uEnableTextures', TextureManager.areTexturesEnabled());
		
        /*if(this.boneIndiciesBuffer != undefined) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.boneIndiciesBuffer);
            gl.enableVertexAttribArray(ShaderManager.getCurrent().program.boneIndiciesAttribute);
            gl.vertexAttribPointer(ShaderManager.getCurrent().program.boneIndiciesAttribute, this.boneIndiciesBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.boneWeightsBuffer);
            gl.enableVertexAttribArray(ShaderManager.getCurrent().program.boneWeightsAttribute);
            gl.vertexAttribPointer(ShaderManager.getCurrent().program.boneWeightsAttribute, this.boneWeightsBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }else if(ShaderManager.getCurrent().program.boneIndiciesAttribute != undefined){
            gl.disableVertexAttribArray(ShaderManager.getCurrent().program.boneIndiciesAttribute);
            gl.disableVertexAttribArray(ShaderManager.getCurrent().program.boneWeightsAttribute);
        }*/
        
        gl.drawArrays(gl.TRIANGLES, 0, this.positionBuffer.numItems);
    };
    
    this.fillOut = function(vertices, colors, texCoords, normals) {
        this.positionBuffer.itemSize = 3;
        this.positionBuffer.numItems = vertices.length/3;
        this.colorBuffer.itemSize = 4;
        this.colorBuffer.numItems = vertices.length/3;
        this.textureCoordBuffer.itemSize = 2;
        this.textureCoordBuffer.numItems = vertices.length/3;
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = vertices.length/3;
        
        if(colors == undefined) {
            colors = new Array();
            for(var i = 0; i < this.colorBuffer.numItems; i++) {
                colors.push(1);
                colors.push(1);
                colors.push(1);
                colors.push(1);
            }
        }
        
        if(texCoords == undefined) {
            texCoords = new Array();
            for(var i = 0; i < this.textureCoordBuffer.numItems; i++) {
                texCoords.push(0);
                texCoords.push(0);
            }
        }
        
        if(normals == undefined) {
            normals = new Array();
            for(var i = 0; i < this.normalBuffer.numItems; i++) {
                normals.push(0);
                normals.push(0);
                normals.push(1);
            }
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    },
    
    this.fillOutBoneWeights = function(influencesPerVertex, boneIndicies, boneWeights) {
        this.boneIndiciesBuffer = gl.createBuffer();
        this.boneWeightsBuffer = gl.createBuffer();
        
        this.boneIndiciesBuffer.itemSize = influencesPerVertex;
        this.boneIndiciesBuffer.numItems = boneIndicies.length/influencesPerVertex;
        this.boneWeightsBuffer.itemSize = influencesPerVertex;
        this.boneWeightsBuffer.numItems = boneIndicies.length/influencesPerVertex;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.boneIndiciesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boneIndicies), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.boneWeightsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boneWeights), gl.STATIC_DRAW);
    }
    
    this.cleanUp = function() {
        gl.deleteBuffer(this.vertices);
        gl.deleteBuffer(this.colorBuffer);
        gl.deleteBuffer(this.textureCoordBuffer);
        gl.deleteBuffer(this.normalBuffer);
        
        if(this.boneIndiciesBuffer != undefined) {
            gl.deleteBuffer(this.boneIndiciesBuffer);
            gl.deleteBuffer(this.boneWeightsBuffer);
        }
    };
}