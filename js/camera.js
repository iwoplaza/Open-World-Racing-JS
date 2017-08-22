var Camera = {
	viewMatrix: mat4.create(),
    rotation: new Vector3(),
    distance: 7.0,
	type: 0,
    
	updateViewMatrix: function() {
		this.identity();
        var car = ScreenHandler.currentScreen.car;
        if(this.type == 0) {
            mat4.translate(this.viewMatrix, [0,0,-this.distance-Math.max(0, car.speed)*0.1]);
            mat4.rotate(this.viewMatrix, this.rotation.x/180.0*Math.PI, [1, 0, 0]);
            mat4.rotate(this.viewMatrix, this.rotation.y/180.0*Math.PI, [0, 1, 0]);
            mat4.translate(this.viewMatrix, [-car.buttOffset, 0, 0]);
            mat4.rotate(this.viewMatrix, -car.angle + car.rotation*5,[0,1,0]);
            mat4.translate(this.viewMatrix, [-car.x, -car.y, -car.z]);
        }else{
            mat4.rotate(this.viewMatrix, this.rotation.x/180.0*Math.PI, [1, 0, 0]);
            mat4.rotate(this.viewMatrix, this.rotation.y/180.0*Math.PI, [0, 1, 0]);
            mat4.translate(this.viewMatrix, [-1.2, -0.8, 0.6]);
            mat4.rotate(this.viewMatrix, -car.angle,[0,1,0]);
            mat4.translate(this.viewMatrix, [-car.x, -car.y, -car.z]);
        }
	},
    
    getLookVector: function() {
        var vec = new Vector3f();
        
        vec.x = Math.sin(this.rotation.y/180.0*Math.PI)*Math.cos(this.rotation.x/180.0*Math.PI);
        vec.z = -Math.cos(this.rotation.y/180.0*Math.PI)*Math.cos(this.rotation.x/180.0*Math.PI);
        vec.y = -Math.sin(this.rotation.x/180.0*Math.PI);
        
        return vec;
    },
    
    getForwardVector: function() {
        var vec = new Vector3f();
        
        vec.x = Math.sin(this.rotation.y/180.0*Math.PI);
        vec.z = -Math.cos(this.rotation.y/180.0*Math.PI);
        
        return vec;
    },
    
    getRightVector: function() {
        var vec = new Vector3f();
        
        vec.x = Math.sin(this.rotation.y/180.0*Math.PI+Math.PI/2);
        vec.z = -Math.cos(this.rotation.y/180.0*Math.PI+Math.PI/2);
        
        return vec;
    },
	
	identity: function() {
		mat4.identity(this.viewMatrix);
	},
};