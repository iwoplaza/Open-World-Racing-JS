function ScreenGame() {
    this.keyState = new Array(127),
    this.framebuffer = new Framebuffer(gl.viewportWidth, gl.viewportWidth),
    this.ticks = 0;
        
    this.update = function() {
        this.ticks += Time.delta;
        
        SceneManager.current.update();
        this.car.update();
    }
    
    this.display = function() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.2, 0.7, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        GLHelper.perspective(75, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
        GLHelper.identityModel();
        GLHelper.resetToWorldMatrix();
        SceneManager.current.processLighting();
        
        //World.display();
        SceneManager.current.draw();
        this.car.display();
    }

    this.handleKeyPressed = function(event) {
        var keyCode = event.keyCode ? event.keyCode : event.which;
        this.keyState[keyCode] = true;
        console.log(keyCode);
    }

    this.handleKeyReleased = function(event) {
        var keyCode = event.keyCode ? event.keyCode : event.which;
        this.keyState[keyCode] = false;
    }

    this.handleMouseMove = function(event) {
        if(PointerLock.isLocked()) {
            var mouseSensitivity = 0.002;
            Camera.rotation.x += Mouse.movementY*(mouseSensitivity*60);
            Camera.rotation.x = Math.max(Math.min(Camera.rotation.x, 45.0), -15.0);
            Camera.rotation.y += Mouse.movementX*(mouseSensitivity*60);
        }
    }
    
    this.handleMousePressed = function(event) {
        if(event.button == 0 && !PointerLock.isLocked()) {
            PointerLock.request();
        }else{
            switch(event.button){
                case 2:
                    Camera.type = !Camera.type;
                    break;
                default:
                    break;
            }
        }
    }

    this.clean = function() {
        this.framebuffer.clean();
    }
}

ScreenGame.prototype.init = function() {
    console.log("Opened Game Screen!");
    Camera.rotation.y = 90.0;
    Camera.rotation.x = 20.0;
    this.car = new Car(0,0,0);
    
    SceneManager.current.init();
    
    //GameObjects.add(new GameObject("testObject").setLocation(0, 2, 0).addComponent(new ComponentMesh("car", "environment")).markUpdatable());
}