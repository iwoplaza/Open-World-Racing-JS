var Components = {
    componentTypes: [],
    register: function(component) {
        component.prototype.name = component.name;
        this.componentTypes[component.name] = component;
    }
};

function Component() {
    
}