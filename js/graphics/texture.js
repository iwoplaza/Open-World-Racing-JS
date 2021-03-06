//The TextureManager handles all-things textures.

var TextureManager = {
    texturesEnabled: false,
    database: new Array(0),
    
    handleTextureLoaded: function(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },

    enableTextures: function() {
        this.texturesEnabled = true;
    },

    disableTextures: function() {
        this.texturesEnabled = false;
    },

    areTexturesEnabled: function() {
        return this.texturesEnabled;
    },

    bindTexture: function(textureId) {
        this.enableTextures();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureId);
        ShaderManager.setUniform1i("uSampler", 0);
    },

    preload: function() {
        
    },

    loadResource: function(resourceManager, filePath) {
        if(TextureManager.database[filePath] != undefined)
            return;
        
        resourceManager.addTask();
        var fontImage = new Image();
		fontImage.resourceManager = resourceManager;
        fontImage.onload = function() {
            var texture = gl.createTexture();
            TextureManager.handleTextureLoaded(this, texture);
            TextureManager.database[filePath] = {
                textureId: texture,
                width: this.width,
                height: this.height
            };
            this.resourceManager.releaseTask();
        }
        fontImage.src = "res/textures/"+filePath;
    }
}