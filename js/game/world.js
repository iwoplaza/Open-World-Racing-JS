var World = {
    display: function() {
        GLHelper.saveState();
        TextureManager.disableTextures();
        for (var group in this.model){
            if (group!="mtllib"){
                for (var node in this.model[group]){
                    GLHelper.saveState();
                    GLHelper.translate(this.model[group][node].offset);
                    this.model[group][node].mesh.draw();
                    GLHelper.loadState();
                }
            }
        }
		GLHelper.loadState();
    }
};
World.init = function(){
    World.model = ModelLib["town"];
    console.log("test");
}