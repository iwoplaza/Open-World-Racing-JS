function Resources() {
    this.remainingTasks = 0;
}

Resources.prototype.preloadFromFile = function(filename, callback) {
    this.callback = callback;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.resourceManager = this;
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.status==200 && xmlhttp.readyState==4){
            this.resourceManager.load(JSON.parse(xmlhttp.responseText));
        }
    }
    xmlhttp.open("GET","res/"+filename,true);
    xmlhttp.send();
}

Resources.prototype.load = function(jsonData) {
    //Loading Shaders
    for(let i in jsonData.shaders) {
        let shader = jsonData.shaders[i];
        ShaderManager.loadResource(this, shader);
    }
	
	//Loading Textures
    for(let i in jsonData.textures) {
        let texture = jsonData.textures[i];
        TextureManager.loadResource(this, texture);
    }
    
    //Loading Scene
    if(jsonData.scene) {
        SceneLoader.loadResource(this, jsonData.scene);
    }
}

Resources.prototype.addTask = function() {
    this.remainingTasks++;
}

Resources.prototype.releaseTask = function() {
    this.remainingTasks--;
    if(this.remainingTasks <= 0)
        this.callback();
}

Resources.prototype.ROOT_PATH = "res/";