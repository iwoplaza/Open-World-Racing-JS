function length2(x, y){
	return Math.sqrt(x*x + y*y);
}

function normalize2(x, y) {
	var len = length2(x, y);
	if(len == 0){
		len = 1;
	}
	var _x = x/len;
	var _y = y/len;
	return [_x, _y];
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}