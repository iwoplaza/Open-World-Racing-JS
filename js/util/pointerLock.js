var PointerLock = {
    element: undefined,
    enabled: false,
    locked: false,
    
    init: function(p_element) {
        this.element = p_element;
        var havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;
        
        if(!havePointerLock) {
            alert("Your browser doesn't support the pointer lock. Try using Chrome or Mozilla Firefox.");
        }else{
            this.enabled = true;
            
            this.element.requestPointerLock = this.element.requestPointerLock ||
            this.element.mozRequestPointerLock ||
            this.element.webkitRequestPointerLock;
            
            document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock;
            
            document.addEventListener('pointerlockchange', this.changeCallback, false);
            document.addEventListener('mozpointerlockchange', this.changeCallback, false);
            document.addEventListener('webkitpointerlockchange', this.changeCallback, false);
        }
    },
    
    changeCallback: function(e) {
        PointerLock.locked = (document.pointerLockElement != undefined || document.mozPointerLockElement != undefined);
    },
    
    isCompatible: function() {
        return this.enabled;
    },
    
    isLocked: function() {
        return this.locked;
    },
    
    request: function() {
        this.element.requestPointerLock();
    },
    
    exit: function() {
    }
};