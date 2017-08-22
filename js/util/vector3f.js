function Vector3(p_x, p_y, p_z) {
    this.x = p_x || 0;
	this.y = p_y || 0;
    this.z = p_z || 0;

	this.getLength = function() {
		return Math.sqrt(this.getLengthSquared());
    };
    
    this.getLengthSquared = function() {
		return this.x*this.x + this.y*this.y + this.z*this.z;
    };

    this.normalize = function() {
		var length = this.getLength();
		if(length == 0) return;
		this.x /= length;
		this.y /= length;
        this.z /= length;
	};
    
    this.set = function(p_vec) {
        this.x = p_vec.x;
        this.y = p_vec.y;
        this.z = p_vec.z;
    };
    
    this.add = function(p_vec) {
        this.x += p_vec.x;
        this.y += p_vec.y;
        this.z += p_vec.z;
    };
    
    this.getAdded = function(p_vec) {
        return new Vector3(this.x + p_vec.x, this.y + p_vec.y, this.z + p_vec.z);
    };
    
    this.getMultiplied = function(p_x, p_y, p_z) {
        p_y = p_y || p_x;
        p_z = p_z || p_x;
        
        return new Vector3(this.x*p_x, this.y*p_y, this.z*p_z);
    };
    
    this.getInverted = function() {
        return this.getMultiplied(-1);
    };
    
    this.getNormalized = function() {
		var length = this.getLength();
		if(length == 0) return new Vector3(0, 0, 0);
		return new Vector3(this.x / length, this.y / length, this.z / length);
    };
    
    this.multiply = function(p_x, p_y, p_z) {
        this.set(this.getMultiplied(p_x, p_y, p_z));
    };
    
    this.invert = function() {
        this.set(this.getInverted());
    };
    
    this.dot = function(vec) {
        return this.x*vec.x + this.y*vec.y + this.z*vec.z;
    }
    
    this.getSquareDistanceTo = function(p_vec) {
        var vec = this.getAdded(p_vec.getInverted());
        return vec.getLengthSquared();
    };
}

Vector3.clone = function(p_vec) {
    return new Vector3(p_vec.x, p_vec.y, p_vec.z);
}