function ComponentLight() {
    Component.call(this);
}
ComponentLight.prototype = Object.create(Component.prototype);
Components.register(ComponentLight);

/*
    Properties:
        strength: number,
        color: [r, g, b]
*/
ComponentLight.prototype.init = function() {
    
}