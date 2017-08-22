var canvas;
var gl;
var keyState = new Array(127);

var key_Left = 65;
var key_Right = 68;
var key_Up = 87;
var key_Down = 83;
var key_Interact = 69;

function initGL() {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
    
    GLHelper.loadExtensions();
}

window.onkeydown = function (e) {
	var code = e.keyCode ? e.keyCode : e.which;
	keyState[code] = true;
    
    ScreenHandler.handleKeyPressed(e);
    
    if(code == 32) e.preventDefault();
}

window.onkeyup = function(e) {
	var code = e.keyCode ? e.keyCode : e.which;
	keyState[code] = false;
    
    ScreenHandler.handleKeyReleased(e);
    
    if(e.shiftKey) isShiftDown = false;
}

function tick() {
    Time.tick();
    
	if(ResourceManager.drawLoadingScreen()){
		update();
		drawScene();
	}
    
    requestAnimationFrame(tick);
}

function update() {
    ScreenHandler.update();
}

function drawScene() {
    ScreenHandler.display();
    
    GLHelper.handleStateErrors();
}

function webGLStart() {
    canvas = document.getElementById("gameCanvas");
    initGL();
    ShaderManager.init();
    PointerLock.init(canvas);
    Car.init();
    World.init();

	for(var i = 0; i < keyState.length; i++){
		keyState[i] = false;
	}
	
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
    gl.bindTexture(gl.TEXTURE_2D, null);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    
	ResourceManager.preloadBaseResources();
    
    tick();
}

function onFinishedLoading(){
    console.log("Finished loading resources!");
    
    gameStart();
}

function gameStart() {
    ScreenHandler.open(new ScreenGame());
}