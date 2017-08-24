
function GameObject(_name) {
    this.name = _name;
    this.location = new Vector3(0, 0, 0);
    this.componentGroups = [];
    this.needsUpdates = false;
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
    if(!this.componentGroups[component.name])
        this.componentGroups[component.name] = [];
    
    component.gameObject = this;
    this.componentGroups[component.name].push(component);
    return this;
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

GameObject.prototype.setLocation = function(x, y, z) {
    this.location = new Vector3(x, y, z);
    return this;
}