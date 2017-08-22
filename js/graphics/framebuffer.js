function Framebuffer(p_width, p_height) {
    this.width = p_width;
    this.height = p_height;
    
    this.init = function() {
        this.framebufferID = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferID);
        
        //Color Texture
        this.textureColorID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.textureColorID);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.renderbufferID = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbufferID);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureColorID, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbufferID);
        
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    
    this.bind = function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferID);
        gl.viewport(0, 0, this.width, this.height);
    };
    
    this.unbind = function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    
    this.clean = function() {
        gl.deleteTexture(this.textureColorID);
        gl.deleteRenderbuffer(this.renderbufferID);
        gl.deleteFramebuffer(this.framebufferID);
    };
    
    this.init();
}