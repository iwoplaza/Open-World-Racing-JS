function createAnimationHandler(p_frames) {
    return {
        frames: p_frames,
        currentFrame: 0,
        
        getCurrentFrame: function() {
            return this.frames[Math.floor(this.currentFrame)];
        },
        
        progress: function(p_num) {
            this.currentFrame += p_num;
            while(this.currentFrame >= this.frames.length) {
                this.currentFrame -= this.frames.length;
            }
        },
        
        setFrame: function(p_frame) {
            this.currentFrame = p_frame;
        }
    };
}