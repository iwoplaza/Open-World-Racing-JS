var Time = {
    //Previous time used to calculate the delta
    last: Date.now(),
    //The elapsed time between ticks
    delta: 0,
    //The value that the deltaTime is capped at, to prevent jumping in time
    deltaCap: 1/60,
    
    //This is ran each tick, and calculates the delta
    tick: function() {
        let now = Date.now();
        this.delta = Math.min((now - this.last)/1000, this.deltaCap);
        this.last = now;
    }
};