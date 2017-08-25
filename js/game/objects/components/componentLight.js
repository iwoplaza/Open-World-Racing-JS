function ComponentLight() {
    Component.call(this);
}
ComponentLight.prototype = Object.create(Component.prototype);
Components.register(ComponentLight);

/*
    Properties:
        range: number,
        color: [r, g, b, a]
*/
ComponentLight.prototype.init = function() {
    
}

ComponentLight.prototype.emit = function() {
    return this;
}