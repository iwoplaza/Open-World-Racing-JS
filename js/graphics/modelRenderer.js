var ModelRenderer = {
    renderList: [[],[],[],[],[]],
    mtllib: undefined,
    renderModel: function(model){
        for (var group in model){
            switch(group){
                case "frame":
                    this.renderList[0] = model[group];
                    break;
                case "interior":
                    this.renderList[1] = model[group];
                    break;
                case "window":
                    this.renderList[2] = model[group];
                    break;
                case "sWheel":
                case "nWheel":
                case "rWheel":
                    for (var node in model[group]) this.renderList[3][node] = model[group][node];  
                    break;
                case "mtllib":
                    this.mtllib = model[group];
                    break;
                default:
                    for (var node in model[group]) this.renderList[4][node] = model[group][node];
                    break;
            }
        };
        for (var y=0;y<this.renderList.length;y++){
            for (var x in this.renderList[y]){
                ModelRenderer.renderPart(this.renderList[y][x]);
            }
        }
        this.renderList = [[],[],[],[],[]];
        this.mtllib = undefined;
    },
    renderPart: function(part){
        GLHelper.saveState();
        GLHelper.translate(part.offset);
        GLHelper.rotate(part.rotation.y, [0, 0, 1]);
        GLHelper.rotate(part.rotation.z, [0, 1, 0]);
        GLHelper.rotate(part.rotation.x, [1, 0, 0]);
        TextureManager.disableTextures();
        if(MtlLib[this.mtllib]){
            if (MtlLib[this.mtllib][part.mtl]){
                if (MtlLib[this.mtllib][part.mtl].texture != "."){
                    TextureManager.enableTextures();
                    TextureManager.bindTexture(TextureManager.database[MtlLib[this.mtllib][part.mtl].texture].textureId);
                }
            }
        }
        part.mesh.draw();
        GLHelper.loadState();
    }
}