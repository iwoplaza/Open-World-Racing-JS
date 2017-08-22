function NoiseGenerator(p_seed, p_width, p_height) {
    this.seed = p_seed;
    this.width = p_width;
    this.height = p_height;
    
    /*this.getNoise = function(p_x, p_y) {
        var i = this.seed*3.7541 + p_x*p_x*p_x + p_y*p_y;
        return Math.abs(Math.sin(i*0.1251-this.seed*0.17)+Math.cos(i*i*468+this.seed*0.43));
    }*/
    
    this.getNoise = function(nx, ny) {
      return NoiseGenerator.gen.noise(nx, ny) / 2 + 0.5;
    }
}
NoiseGenerator.gen = new SimplexNoise();