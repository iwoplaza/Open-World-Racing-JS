function ComponentLight() {
    Component.call(this);
    this.ambientColor = [0.1, 0.1, 0.1];
    this.diffuseColor = [0.9, 0.9, 0.9];
    this.range = 10;
}
ComponentLight.prototype = Object.create(Component.prototype);
Components.register(ComponentLight);

/*
    Properties:
        range: number,
        ambientColor: [r, g, b]
        diffuseColor: [r, g, b]
*/
ComponentLight.prototype.init = function() {
    
}

ComponentLight.prototype.emit = function() {
    return this;
}