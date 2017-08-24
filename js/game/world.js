var World = {
    display: function() {
        GLHelper.saveState();
        TextureManager.disableTextures();
        for (var i in this.model){
            if (i != "mtllib"){
                GLHelper.saveState();
                GLHelper.translate(this.model[i].offset);
                this.model[i].mesh.draw();
                GLHelper.loadState();
            }
        }
		GLHelper.loadState();
    }
};
World.init = function(){
    World.model = ModelLib["town"];
    console.log("test");
}