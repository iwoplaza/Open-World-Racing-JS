var GameObjects = {
    list: [],
    updatableList: [],
    
    update: function() {
        for(let i in this.updatableList) {
            let gameObject = this.updatableList[i];
            if(gameObject && gameObject.update)
                gameObject.update();
        }
    },
    
    draw: function() {
        for(let i in this.list) {
            let gameObject = this.list[i];
            if(gameObject && gameObject.draw)
                gameObject.draw();
        }
    },
    
    add: function(gameObject) {
        this.list[gameObject.name] = gameObject;
    },
    
    registerUpdatable: function(gameObject) {
        this.updatableList.push(gameObject);
    }
};

function GameObject(_name) {
    this.name = _name;
    this.componentGroups = [];
    this.needsUpdates = false;
}

GameObject.prototype.markUpdatable() {
    this.needsUpdates = true;
    GameObjects.registerUpdatable(this);
    return this;
}