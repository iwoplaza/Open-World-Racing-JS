var ResourceManager = {
    resourcesToLoad: 0,
    resourcesLoaded: 0,
    loadingResources: true,
    loadingBarHolderRO: undefined,
    loadingBarRO: undefined,

    loadPhasesBase: [
        function() {
            //Font.init();
            //initSpritesheets();
            //initAudio();
            TextureManager.preload();
        }
    ],
    currentPhase: 0,

    preloadBaseResources: function(){
        this.loadingBarHolderRO = new Mesh();
        this.loadingBarRO = new Mesh();
        drawRect(this.loadingBarRO, 0, -18, 200-4, 36, [1, 1, 1, 1]);

        this.resourcesToLoad = 0;
        this.resourcesLoaded = 0;
        this.currentPhase = 0;

        this.loadPhasesBase[this.currentPhase]();
    },

    drawLoadingScreen: function() {
        ShaderManager.use("default");
        
        if(this.resourcesLoaded < this.resourcesToLoad){
            console.log("Progress: " + this.resourcesLoaded + " / " + this.resourcesToLoad);
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);

            GLHelper.resetToGuiMatrix();

            if(this.resourcesToLoad > 0){
                GLHelper.translate([gl.viewportWidth/2-100+2, gl.viewportHeight/2-20+2, 0]);
                GLHelper.scale([(this.resourcesLoaded/this.resourcesToLoad), 1, 1]);
                this.loadingBarRO.draw();
            }

            return false;
        }else if(this.loadingResources){
            if(this.currentPhase+1 < this.loadPhasesBase.length) {
                this.currentPhase++;
                this.loadPhasesBase[this.currentPhase]();
                console.log("Launching phase " + this.currentPhase);
                return false;
            }else{
                onFinishedLoading();
                this.loadingResources = false;
            }
        }

        return true;
    },
    
    registerResourceToLoad: function() {
        this.resourcesToLoad++;
    },
    
    checkOutResourceLoaded: function() {
        this.resourcesLoaded++;
    }
}