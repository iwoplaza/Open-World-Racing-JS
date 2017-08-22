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
        this.loadTexture("res/car.png");
        this.loadTexture("res/interior.png");
    },

    loadTexture: function(filePath) {
        ResourceManager.registerResourceToLoad();
        var fontImage = new Image();
        fontImage.onload = function() {
            var texture = gl.createTexture();
            TextureManager.handleTextureLoaded(this, texture);
            TextureManager.database[filePath] = {
                textureId: texture,
                width: this.width,
                height: this.height
            };
            ResourceManager.checkOutResourceLoaded();
        }
        fontImage.src = filePath;
    }
}