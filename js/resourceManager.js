function ResourceManager() {
    this.remainingTasks = 0;
}

ResourceManager.prototype.preloadFromFile = function(filename, callback) {
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

ResourceManager.prototype.load = function(jsonData) {
    //Loading Shaders
    for(let i in jsonData.shaders) {
        let shader = jsonData.shaders[i];
        ShaderManager.loadResource(this, shader);
    }
}

ResourceManager.prototype.addTask = function() {
    this.remainingTasks++;
}

ResourceManager.prototype.releaseTask = function() {
    this.remainingTasks--;
    if(this.remainingTasks <= 0)
        this.callback();
}