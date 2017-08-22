function Vector2f(p_x, p_y) {
    this.x = p_x || 0;
	this.y = p_y || 0;

	this.getLength = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
    };

    this.normalize = function() {
		var length = this.getLength();
		if(length == 0) return;
		this.x/=length;
		this.y/=length;
	};
    
    this.set = function(p_vec) {
        this.x = p_vec.x;
        this.y = p_vec.y;
    };
    
    this.getMultiplied = function(p_x, p_y) {
        p_y = p_y || p_x;
        
        return new Vector2f(this.x*p_x, this.y*p_y);
    };
    
    this.getInverted = function() {
        return this.getMultiplied(-1);
    };
    
    this.multiply = function(p_x, p_y) {
        this.set(this.getMultiplied(p_x, p_y));
    };
    
    this.invert = function() {
        this.set(this.getInverted());
    };
}