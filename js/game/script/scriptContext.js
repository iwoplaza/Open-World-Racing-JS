var ScriptContext = {
    components: [],
    
    makeComponent: function(_name) {
        this.components.push({name: _name, handlers: []});
    },
    
    popComponent: function() {
        return this.components.pop();
    },
    
    handleEvent: function(_event, _callback) {
        if(this.components.length > 0)
            this.components[this.components.length-1].handlers[_event] = _callback;
    }
};