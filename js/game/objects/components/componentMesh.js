function ComponentMesh() {
    Component.call(this);
    
    this.modelName = "";
    this.shader = "environment";
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
                var texture = this.model.mtllib;
                if(MtlLib[texture])
                    TextureManager.bindTexture(TextureManager.database[MtlLib[texture][this.model[group][node].mtl].texture].textureId);
                this.model[group][node].mesh.draw();
                GLHelper.loadState();
            }
        }
    }
}