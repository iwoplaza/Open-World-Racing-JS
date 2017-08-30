function Car(p_x, p_y, p_z) {
	this.x = p_x;
	this.y = p_y;
    this.z = p_z;
    this.angle = 0;
    this.rotation = 0;
    this.rotationLimit = 0.05;
    this.wheelAngle = 0;
    this.speed = 0;
    this.wheel_rotations = new Array(4);
    this.bodyColor = [Math.random(), Math.random(), Math.random()];
    this.velocity = new Vector3(0, 0, 0);
    this.maxVelocity = 25;
    this.buttOffset = 1.32979;
    
    this.dot = 0;
    this.init = function() {
        this.model = Object.create(ModelLib["models/truck.obj"]);
    }
    this.update = function() {
        if (keyState[87]){
            this.speed+=2.00;
            //this.speed = this.speed<0?this.speed*0.95:this.speed;
        }
        if (keyState[83]){
            this.speed+=-2.00;
            //this.speed = this.speed>0?this.speed*0.95:this.speed;
        }
        
        this.speed = Math.max(Math.min(this.speed, 40), -20);
        this.wheelAngle = 0;
        
        if (!keyState[87] && !keyState[83]) {
            this.speed = this.speed*0.99;
            this.velocity.x *= 0.95;
            this.velocity.z *= 0.95;
        }
        
        if (this.model["sWheel"]){
            for (var node in this.model["sWheel"]){
                this.model["sWheel"][node].rotation.x += this.speed*Math.PI/180;
            }
        }
        if (this.model["nWheel"]){
            for (var node in this.model["nWheel"]){
                this.model["nWheel"][node].rotation.x += this.speed*Math.PI/180;
            }
        }
        
        if (keyState[68]) this.turnLeft(1);
        else if (keyState[65]) this.turnRight(1);
        else{
            this.rotation *= 0.98;
        }
        
        var velocityMagnitude = this.getVelocityMagnitude();
        this.rotation *= Math.min(1, 0.9+velocityMagnitude*0.01);
        
        if(keyState[32]) {
           this.speed *= 0.5;
        }
        
        this.angle += this.rotation;
        this.rotation = Math.max(-this.rotationLimit, Math.min(this.rotation, this.rotationLimit));
        
        if(velocityMagnitude > this.maxVelocity) {
            this.velocity.normalize();
            this.velocity.multiply(this.maxVelocity, this.maxVelocity, this.maxVelocity);
        }
        
        this.velocity.x+=Math.cos(this.angle)*(this.speed)*Time.delta;
        this.velocity.z-=Math.sin(this.angle)*(this.speed)*Time.delta;
        
        this.x += this.velocity.x*Time.delta;
        this.z += this.velocity.z*Time.delta;
        
        this.dot = this.velocity.getNormalized().dot(new Vector3(Math.cos(this.angle)*(this.speed)*Time.delta, 0, -Math.sin(this.angle)*(this.speed)*Time.delta));
        if(this.dot < 0.1 && this.speed > 20)
            console.log("Drift:" + this.dot);
    }
    
	this.display = function() {
        //this.model["frontLeft"].rotation.z = this.wheelAngle;
        //this.model["frontRight"].rotation.z = this.wheelAngle;
        if (this.model["sWheel"]){
            for (var node in this.model["sWheel"]){
                this.model["sWheel"][node].rotation.z = this.wheelAngle;
            }
        }
        if (this.model["rWheel"]){
            for (var node in this.model["rWheel"]){
                this.model["rWheel"][node].rotation.z = -this.wheelAngle;
            }
        }
        
        ShaderManager.use("shaders/car.shader");
        ShaderManager.setUniform3f("uBodyColor", this.bodyColor[0], this.bodyColor[1], this.bodyColor[2]);
        
		GLHelper.saveState();
        GLHelper.translate([this.x,this.y,this.z]);
        GLHelper.rotate(this.angle+(90*Math.PI/180),[0,1,0]);
        GLHelper.translate([0, 0, this.buttOffset]);
        
        ModelRenderer.renderModel(this.model);
        
		GLHelper.loadState();
	}
    
    this.turnLeft = function(force) {
        var inverseMultiplier = (this.speed/Math.abs(this.speed));
        if(this.speed == 0) inverseMultiplier = 0;
        this.rotation -= force*0.03*Math.min(this.getVelocityMagnitude()*0.1, 1)*inverseMultiplier*Time.delta;
        this.wheelAngle = -0.5;
    }
    
    this.turnRight = function(force) {
        var inverseMultiplier = (this.speed/Math.abs(this.speed));
        if(this.speed == 0) inverseMultiplier = 0;
        this.rotation += force*0.03*Math.min(this.getVelocityMagnitude()*0.1, 1)*inverseMultiplier*Time.delta;
        this.wheelAngle = 0.5;
    }
    
    this.getVelocityMagnitude = function() {
        return this.velocity.getLength();
    }
    
    this.init();
}