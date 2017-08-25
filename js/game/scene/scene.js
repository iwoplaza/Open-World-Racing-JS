var SceneManager = {
    current: null
};

function Scene(_name) {
    this.name = _name;
    this.initialized = false;
    this.gameObjects = [];
    this.updatableList = [];
    this.emissiveList = [];
    
    this.lightsList = [];
}

Scene.prototype.setName = function(_name) {
    this.name = _name;
    return this;
}

Scene.prototype.update = function() {
    for(let i in this.updatableList) {
        let gameObject = this.updatableList[i];
        if(gameObject && gameObject.update)
            gameObject.update();
    }
}

Scene.prototype.draw = function() {
    for(let i in this.gameObjects) {
        let gameObject = this.gameObjects[i];
        if(gameObject && gameObject.draw)
            gameObject.draw();
    }
}

Scene.prototype.processLighting = function() {
    ShaderManager.populateLightingData(this.lightsList);
}

Scene.prototype.registerUpdatable = function(gameObject) {
    this.updatableList.push(gameObject);
}

Scene.prototype.registerEmissive = function(gameObject) {
    this.emissiveList.push(gameObject);
    
    if(this.initialized)
        this.updateLightsList();
}

Scene.prototype.unregisterEmissive = function(gameObject) {
    var i = this.emissiveList.indexOf(gameObject);
    if(i != -1) {
        this.emissiveList.splice(i, 1);
    }
    
    if(this.initialized)
        this.updateLightsList();
}

Scene.prototype.updateLightsList = function() {
    this.lightsList = [];
    
    for(let i in this.emissiveList) {
        let gameObject = this.emissiveList[i];
        if(gameObject && gameObject.emit)
            this.lightsList = this.lightsList.concat(gameObject.emit());
    }
}

Scene.prototype.addGameObject = function(gameObject) {
    this.gameObjects[gameObject.name] = gameObject;
    console.log("Added new GameObject:", gameObject.name);
}

Scene.prototype.init = function() {
    this.initialized = true;
    
    for(let i in this.gameObjects) {
        let gameObject = this.gameObjects[i];
        if(gameObject && gameObject.init)
            gameObject.init();
    }
    
    this.updateLightsList();
}