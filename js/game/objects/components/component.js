var Components = {
    componentTypes: [],
    register: function(component) {
        component.prototype.type = component.name;
        this.componentTypes[component.name] = component;
    }
};

function Component() {
    
}