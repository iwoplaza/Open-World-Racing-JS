var GLHelper = {
    ext_draw_buffers: undefined,
    
    modelMatrix: mat4.create(),
    projectionMatrix: mat4.create(),
    normalMatrix: mat4.create(),
    
    loadExtensions: function() {
        this.ext_draw_buffers = gl.getExtension("WEBGL_draw_buffers");
    },
    
    translate: function(p_translation) {
        mat4.translate(this.modelMatrix, p_translation);
    },
    
    rotate: function(p_rotation, p_xyz) {
        mat4.rotate(this.modelMatrix, p_rotation, p_xyz);
        mat4.rotate(this.normalMatrix, p_rotation, p_xyz);
    },
    
    rotateX: function(p_rotation) {
        this.rotate(this.modelMatrix, p_rotation, [1, 0, 0]);
    },
    
    rotateY: function(p_rotation) {
        this.rotate(this.modelMatrix, p_rotation, [0, 1, 0]);
    },
    
    rotateZ: function(p_rotation) {
        this.rotate(this.modelMatrix, p_rotation, [0, 0, 1]);
    },
    
    scale: function(p_scale) {
        mat4.scale(this.modelMatrix, p_scale);
    },
    
    identityModel: function() {
        mat4.identity(this.modelMatrix);
    },
    
    identityProjection: function() {
        mat4.identity(this.projectionMatrix);
    },
    
    identityNormal: function() {
        mat4.identity(this.normalMatrix);
    },
    
    publishMatrixUniforms: function() {
        gl.uniformMatrix4fv(ShaderManager.getUniformLocation('uPMatrix'), false, this.projectionMatrix);
        gl.uniformMatrix4fv(ShaderManager.getUniformLocation('uMMatrix'), false, this.modelMatrix);
        gl.uniformMatrix4fv(ShaderManager.getUniformLocation('uVMatrix'), false, Camera.viewMatrix);
        gl.uniformMatrix4fv(ShaderManager.getUniformLocation('uNMatrix'), false, this.normalMatrix);
    },
    
    resetToWorldMatrix: function() {
        this.identityModel();
        this.identityNormal();
        Camera.updateViewMatrix();
    },
    
    resetToGuiMatrix: function() {
        this.identityModel();
        this.identityNormal();
        Camera.identity();
    },
    
    ortho: function(p_left, p_right, p_bottom, p_top, p_near, p_far) {
        mat4.ortho(p_left, p_right, p_bottom, p_top, p_near, p_far, this.projectionMatrix);
    },
    
    perspective: function(p_angle, p_ratio, p_near, p_far) {
        mat4.perspective(p_angle, p_ratio, p_near, p_far, this.projectionMatrix);
    },
    
    // SAVE STATES
    
    saveStates: new Array(0),
    
    saveState: function() {
        this.saveStates.push({
            modelMatrix: mat4.create(this.modelMatrix),
            projectionMatrix: mat4.create(this.projectionMatrix),
            normalMatrix: mat4.create(this.normalMatrix)
        });
    },
    
    loadState: function() {
        var lastSave = this.saveStates.pop();
        this.modelMatrix = lastSave.modelMatrix;
        this.projectionMatrix = lastSave.projectionMatrix;
        this.normalMatrix = lastSave.normalMatrix;
    },
    
    handleStateErrors: function() {
        if(this.saveStates.length > 0) {
            console.error("[GL Helper] There are " + this.saveStates.length + " save states (0 expected).");
        }
    }
};