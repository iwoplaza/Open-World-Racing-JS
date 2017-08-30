function ComponentScript() {
    Component.call(this);
    
    this.script = undefined;
}
ComponentScript.prototype = Object.create(Component.prototype);
Components.register(ComponentScript);

/*
    Properties:
        script: string
*/
ComponentScript.prototype.init = function() {
    var script = this;
    $.getScript(Resources.prototype.ROOT_PATH + this.script)
        .done(function() {
            var component = ScriptContext.popComponent();
            script.handlers = component.handlers;
        }).fail(function() {
        
    });
}

ComponentScript.prototype.update = function() {
    if(this.handlers && this.handlers.update)
        this.handlers.update.call(this);
}