
function GameObject(_name) {
    this.name = _name;
    var location = new Vector3(0, 0, 0);
    this.componentGroups = [];
    this.needsUpdates = false;
    this.emissive = false;
}

GameObject.prototype.init = function() {
    for(let group in this.componentGroups) {
        for(let i in this.componentGroups[group]) {
            var component = this.componentGroups[group][i];
            if(component && component.init)
                component.init();
        }
    }
}

GameObject.prototype.markUpdatable = function() {
    this.needsUpdates = true;
    SceneManager.current.registerUpdatable(this);
    return this;
}

GameObject.prototype.addComponent = function(component) {
    if(!this.componentGroups[component.type])
        this.componentGroups[component.type] = [];
    
    component.gameObject = this;
    this.componentGroups[component.type].push(component);
    this.onComponentAdded(component);
    return this;
}

GameObject.prototype.removeComponent = function(component) {
    if(!this.componentGroups[component.type])
       return this;
    
    for(var i in this.componentGroups[component.type]) {
        if(this.componentGroups[component.type][i] == component) {
            this.componentGroups[component.type].splice(i, 1);
            
            this.onComponentRemoved(component);
            return this;
        }
    }
}

GameObject.prototype.onComponentAdded = function(component) {
    if(component.type == "ComponentLight" && !this.emissive) {
        this.emissive = true;
        SceneManager.current.registerEmissive(this);
    }
}

GameObject.prototype.onComponentRemoved = function(component) {
    if(component.type == "ComponentLight") {
        if(component.componentGroups[component.type].length <= 0) {
            this.emissive = false;
            SceneManager.current.unregisterEmissive(this);
        }
    }
}

GameObject.prototype.update = function() {
    for(let group in this.componentGroups) {
        for(let i in this.componentGroups[group]) {
            var component = this.componentGroups[group][i];
            if(component && component.update)
                component.update();
        }
    }
}

GameObject.prototype.draw = function() {
    GLHelper.saveState();
    GLHelper.translate([this.location.x, this.location.y, this.location.z]);
    for(let group in this.componentGroups) {
        for(let i in this.componentGroups[group]) {
            var component = this.componentGroups[group][i];
            if(component && component.draw){
                GLHelper.saveState();
                component.draw();
                GLHelper.loadState();
            }
        }
    }
    GLHelper.loadState();
}

GameObject.prototype.emit = function() {
    var lights = [];
    
    var group = this.componentGroups["ComponentLight"];
    if(group != undefined) {
        for(let i in group) {
            var component = group[i];
            if(component && component.emit){
                lights = lights.concat(component.emit());
            }
        }
    }
    
    return lights;
}

GameObject.prototype.getLocation = function() {
    return location;
}

GameObject.prototype.setLocation = function(x, y, z) {
    this.location = new Vector3(x, y, z);
    if(this.emissive) {
        SceneHandler.current.updateEmissive(this);
    }
    return this;
}