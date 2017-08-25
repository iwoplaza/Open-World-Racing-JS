function ComponentScript() {
    Component.call(this);
    
    this.scriptPath = undefined;
}
ComponentScript.prototype = Object.create(Component.prototype);
Components.register(ComponentScript);

/*
    Properties:
        scriptPath: string
*/
ComponentScript.prototype.init = function() {
    
}

ComponentScript.prototype.update = function() {
    
}