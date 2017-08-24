function ComponentMesh(_modelName, _shader) {
    Component.call(this);
    
    this.model = ModelLib[_modelName];
    this.shader = _shader;
}
ComponentMesh.prototype = Object.create(Component.prototype);
Components.register(ComponentMesh);

/*
    Properties:
        modelName: string,
        shader: string
*/
ComponentMesh.prototype.init = function() {
    this.model = ModelLib[this.modelName];
}

ComponentMesh.prototype.draw = function() {
    ShaderManager.use(this.shader);
    TextureManager.disableTextures();
    
    for (var group in this.model){
        if (group!="mtllib"){
            for (var node in this.model[group]){
                GLHelper.saveState();
                GLHelper.translate(this.model[group][node].offset);
                //TextureManager.bindTexture(TextureManager.database[MtlLib[this.model.mtllib][this.model[group][node].mtl].texture].textureId);
                this.model[group][node].mesh.draw();
                GLHelper.loadState();
            }
        }
    }
}