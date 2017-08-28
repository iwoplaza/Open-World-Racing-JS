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
                    this.renderList[3] = this.renderList[3].concat(model[group]);
                    break;
                case "mtllib":
                    this.mtllib = model[group];
                    break;
                default:
                    this.renderList[4] = this.renderList[4].concat(model[group]);
                    break;
            }
        }
        for (var y=0;y<this.renderList.length;y++){
            for (var x in this.renderList[y]){
                ModelRenderer.renderPart(this.renderList[y][x]);
            }
        }
        this.renderList = [[],[],[],[],[]];
    },
    renderPart: function(part){
        if (!this.t0){
            this.t0 = true;
            console.log(MtlLib[part.mtl]);
        }
        GLHelper.saveState();
        GLHelper.translate(part.offset);
        GLHelper.rotate(part.rotation.z, [0, 1, 0]);
        if(MtlLib[this.mtllib]){
            TextureManager.enableTextures();
            console.log(part.mtl)
            if (MtlLib[this.mtllib][part.mtl].texture != ".") TextureManager.bindTexture(TextureManager.database[MtlLib[this.mtllib][part.mtl].texture].textureId);
        }else{
            TextureManager.disableTextures();
        }
        part.mesh.draw();
        GLHelper.loadState();
    }
}