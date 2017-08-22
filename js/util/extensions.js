String.prototype.beginsWith = function(p_string) {
    return this.substring(0, p_string.length) == p_string;
};