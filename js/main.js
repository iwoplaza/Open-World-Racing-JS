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
    
	update();
	drawScene();
    
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
	PointerLock.init(canvas);
    
	for(var i = 0; i < keyState.length; i++){
		keyState[i] = false;
	}
	
    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
    gl.bindTexture(gl.TEXTURE_2D, null);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.2, 0.7, 1, 1);
    GLHelper.perspective(75, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
    
    mainResourceManager = (new Resources());
    mainResourceManager.preloadFromFile('resources.json', onFinishedLoading);
}

function onFinishedLoading(){
    console.log("Finished loading resources!");
    gameStart();
    tick();
}

function gameStart() {
    ScreenHandler.open(new ScreenGame());
}