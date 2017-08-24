var SceneManager = {
    current: null
};

function Scene(_name) {
    this.name = _name;
    this.gameObjects = [];
    this.updatableList = [];
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

Scene.prototype.registerUpdatable = function(gameObject) {
    this.updatableList.push(gameObject);
}

Scene.prototype.addGameObject = function(gameObject) {
    this.gameObjects[gameObject.name] = gameObject;
    console.log("Added new GameObject:", gameObject.name);
}

Scene.prototype.init = function() {
    for(let i in this.gameObjects) {
        let gameObject = this.gameObjects[i];
        if(gameObject && gameObject.init)
            gameObject.init();
    }
}