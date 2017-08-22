function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function drawCircle(radius, points, outerColor, innerColor){
	vertexPositionBuffer = gl.createBuffer();
	vertexColorBuffer = gl.createBuffer();
	textureCoordBuffer = gl.createBuffer();
	vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = points*3;
    vertexColorBuffer.itemSize = 4;
    vertexColorBuffer.numItems = points*3;
	textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = points*3;
    var vertices = new Array();
    var colors = new Array();
	var texCoords = new Array();
	
    for(var i = 0.0; i < points; i+=1.0){
    	var rad = (i/points)*(Math.PI*2);
    	var rad2 = ((i+1)/points)*(Math.PI*2);
    	var x = Math.sin(rad);
    	var y = Math.cos(rad);
    	var x2 = Math.sin(rad2);
    	var y2 = Math.cos(rad2);
    	//var length = Math.sqrt(x*x + y*y);
    	//var length2 = Math.sqrt(x2*x2 + y2*y2);
		
    	//x/=length;
    	//y/=length;
    	x*=radius;
    	y*=radius;
		
    	//x2/=length2;
    	//y2/=length2;
    	x2*=radius;
    	y2*=radius;

	    vertices.push(x);
	    vertices.push(y);
	    vertices.push(0);

	    vertices.push(x2);
	    vertices.push(y2);
	    vertices.push(0);

	    vertices.push(0);
	    vertices.push(0);
	    vertices.push(0);

	    colors.push(outerColor[0]); colors.push(outerColor[1]); colors.push(outerColor[2]); colors.push(outerColor[3]);
	    colors.push(outerColor[0]); colors.push(outerColor[1]); colors.push(outerColor[2]); colors.push(outerColor[3]);
	    colors.push(innerColor[0]); colors.push(innerColor[1]); colors.push(innerColor[2]); colors.push(innerColor[3]);
	}
	
	for(var i = 0; i < textureCoordBuffer.numItems; i++) {
		texCoords.push(0);
		texCoords.push(0);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
}

function drawCircleCutout(radius, width, points, outerColor, innerColor){
	vertexPositionBuffer = gl.createBuffer();
	vertexColorBuffer = gl.createBuffer();
	textureCoordBuffer = gl.createBuffer();
	vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = points*3*2;
    vertexColorBuffer.itemSize = 4;
    vertexColorBuffer.numItems = points*3*2;
	textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = points*3*2;
    var vertices = new Array();
    var colors = new Array();
	var texCoords = new Array();
	
    for(var i = 0.0; i < points; i+=1.0){
    	var rad = (i/points)*(Math.PI*2);
    	var rad2 = ((i+1)/points)*(Math.PI*2);
    	var x = Math.sin(rad);
    	var y = Math.cos(rad);
    	var x2 = Math.sin(rad2);
    	var y2 = Math.cos(rad2);
		var x3 = x;
    	var y3 = y;
    	var x4 = x2;
    	var y4 = y2;
    	//var length = Math.sqrt(x*x + y*y);
    	//var length2 = Math.sqrt(x2*x2 + y2*y2);
		
    	//x/=length;
    	//y/=length;
    	x*=(radius+width);
    	y*=(radius+width);
		x3*=radius;
    	y3*=radius;
		
    	//x2/=length2;
    	//y2/=length2;
    	x2*=(radius+width);
    	y2*=(radius+width);
		x4*=radius;
    	y4*=radius;
		
	    vertices.push(x);
	    vertices.push(y);
	    vertices.push(0);

	    vertices.push(x2);
	    vertices.push(y2);
	    vertices.push(0);

	    vertices.push(x3);
	    vertices.push(y3);
	    vertices.push(0);
		
		vertices.push(x3);
	    vertices.push(y3);
	    vertices.push(0);

	    vertices.push(x2);
	    vertices.push(y2);
	    vertices.push(0);

	    vertices.push(x4);
	    vertices.push(y4);
	    vertices.push(0);

	    colors.push(outerColor[0]); colors.push(outerColor[1]); colors.push(outerColor[2]); colors.push(outerColor[3]);
	    colors.push(outerColor[0]); colors.push(outerColor[1]); colors.push(outerColor[2]); colors.push(outerColor[3]);
	    colors.push(innerColor[0]); colors.push(innerColor[1]); colors.push(innerColor[2]); colors.push(innerColor[3]);
		colors.push(innerColor[0]); colors.push(innerColor[1]); colors.push(innerColor[2]); colors.push(innerColor[3]);
	    colors.push(outerColor[0]); colors.push(outerColor[1]); colors.push(outerColor[2]); colors.push(outerColor[3]);
	    colors.push(innerColor[0]); colors.push(innerColor[1]); colors.push(innerColor[2]); colors.push(innerColor[3]);
	}
	
	for(var i = 0; i < textureCoordBuffer.numItems; i++) {
		texCoords.push(0);
		texCoords.push(0);
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
}

function warpLength(number, amount) {
	var ret = number;
	if(ret != 1){
		ret *= (amount);
	}
	return ret;
}

function drawComplexCircle(lineList1, scale, angle, points, color, warp){
	warp = warp || 1.0;

	var totalPoints = Math.floor(points*(angle/360.0));
	var complexity = Math.floor(totalPoints/(lineList1.length-1));
	
	vertexPositionBuffer = gl.createBuffer();
	vertexColorBuffer = gl.createBuffer();
	textureCoordBuffer = gl.createBuffer();
	vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = (lineList1.length-1)*complexity*2*3;
    vertexColorBuffer.itemSize = 4;
    vertexColorBuffer.numItems = (lineList1.length-1)*complexity*3*2;
	textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = (lineList1.length-1)*complexity*3*2;
    var vertices = new Array();
    var colors = new Array();
	var texCoords = new Array();
	
	for(var l = 0; l < lineList1.length-1; l++){
		var linePoint1 = lineList1[l];
		var linePoint2 = lineList1[l+1];
		
		for(var i = 0; i < complexity; i++){
			var rad = ((i+l*complexity)/totalPoints)*(angle/180.0*Math.PI);
			var rad2 = (((i+l*complexity)+1)/totalPoints)*(angle/180.0*Math.PI);
			var x = Math.sin(rad);
			var y = Math.cos(rad);
			var x2 = Math.sin(rad2);
			var y2 = Math.cos(rad2);
			var x3 = x;
			var y3 = y;
			var x4 = x2;
			var y4 = y2;
			//var length = Math.sqrt(x*x + y*y);
			//var length2 = Math.sqrt(x2*x2 + y2*y2);
			
			var interRadius1 = (warpLength(linePoint1[0], warp)*(1-i/complexity)+warpLength(linePoint2[0], warp)*(i/complexity));
			var interRadius2 = (warpLength(linePoint1[1], warp)*(1-i/complexity)+warpLength(linePoint2[1], warp)*(i/complexity));

			var interRadius3 = (warpLength(linePoint1[0], warp)*(1-(i+1)/complexity)+warpLength(linePoint2[0], warp)*((i+1)/complexity));
			var interRadius4 = (warpLength(linePoint1[1], warp)*(1-(i+1)/complexity)+warpLength(linePoint2[1], warp)*((i+1)/complexity));

			//x/=length;
			//y/=length;
			x*=(interRadius1*scale);
			y*=(interRadius1*scale);
			x3*=(interRadius2*scale);
			y3*=(interRadius2*scale);
			
			//x2/=length2;
			//y2/=length2;
			x2*=(interRadius3*scale);
			y2*=(interRadius3*scale);
			x4*=(interRadius4*scale);
			y4*=(interRadius4*scale);
			
			vertices.push(x);
			vertices.push(y);
			vertices.push(0);

			vertices.push(x2);
			vertices.push(y2);
			vertices.push(0);

			vertices.push(x3);
			vertices.push(y3);
			vertices.push(0);
			
			vertices.push(x3);
			vertices.push(y3);
			vertices.push(0);

			vertices.push(x2);
			vertices.push(y2);
			vertices.push(0);

			vertices.push(x4);
			vertices.push(y4);
			vertices.push(0);

			colors.push(color[0]); colors.push(color[1]); colors.push(color[2]); colors.push(color[3]);
			colors.push(color[0]); colors.push(color[1]); colors.push(color[2]); colors.push(color[3]);
			colors.push(color[0]); colors.push(color[1]); colors.push(color[2]); colors.push(color[3]);
			colors.push(color[0]); colors.push(color[1]); colors.push(color[2]); colors.push(color[3]);
			colors.push(color[0]); colors.push(color[1]); colors.push(color[2]); colors.push(color[3]);
			colors.push(color[0]); colors.push(color[1]); colors.push(color[2]); colors.push(color[3]);
		}
	}
	
	for(var i = 0; i < textureCoordBuffer.numItems; i++) {
		texCoords.push(0);
		texCoords.push(0);
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
}

function drawRect(renderObject, offsetX, offsetY, width, height, color){
    color = color || [1, 1, 1, 1];
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    
    var texCoords = [
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0]
    ];
    
    var vertices = [offsetX, offsetY, 0,
					offsetX+width, offsetY, 0,
					offsetX, offsetY+height, 0,
					offsetX, offsetY+height, 0,
                    offsetX+width, offsetY, 0,
					offsetX+width, offsetY+height, 0];
    var colors = [color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3]];
    var texCoords2 = [
        texCoords[0][0], texCoords[0][1],
        texCoords[1][0], texCoords[1][1],
        texCoords[3][0], texCoords[3][1],
        texCoords[1][0], texCoords[1][1],
        texCoords[3][0], texCoords[3][1],
        texCoords[2][0], texCoords[2][1]
    ];
    
    renderObject.fillOut(vertices, colors, texCoords2);
}

function drawTexturedRect(renderObject, offsetX, offsetY, width, height, color, texCoords){
    color = color || [1, 1, 1, 1];
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    
    if(texCoords == undefined){
        texCoords = new Array(0);
        texCoords[0] = [0, 1];
        texCoords[1] = [1, 1];
        texCoords[2] = [1, 0];
        texCoords[3] = [0, 0];
    }
    
    var vertices = [offsetX, offsetY, 0,
					offsetX+width, offsetY, 0,
					offsetX, offsetY+height, 0,
					offsetX, offsetY+height, 0,
                    offsetX+width, offsetY, 0,
					offsetX+width, offsetY+height, 0];
    var colors = [color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3]];
    var texCoords2 = [
        texCoords[0][0], texCoords[0][1],
        texCoords[1][0], texCoords[1][1],
        texCoords[3][0], texCoords[3][1],
        texCoords[3][0], texCoords[3][1],
        texCoords[1][0], texCoords[1][1],
        texCoords[2][0], texCoords[2][1]
    ];
    
    renderObject.fillOut(vertices, colors, texCoords2);
}

function drawCube(renderObject, offsetX, offsetY, offsetZ, width, height, length, color){
    color = color || [1, 1, 1, 1];
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    
    var texCoords = new Array();
	for(var i = 0; i < 6*6; i++) {
		texCoords.push(0);
		texCoords.push(0);
	}
    
    var vertices = [
        //Front
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length,
        
        //Back
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        
        //Left
        offsetX, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        
        //Right
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ,
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ+length,
        
        //Down
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        
        //Up
        offsetX, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length
    ];
    
    var colors = [color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3]];
    var colors = new Array();
	for(var i = 0; i < 6*6; i++) {
		colors.push(color[0]);
		colors.push(color[1]);
        colors.push(color[2]);
        colors.push(color[3]);
	}
    
    var normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];
    
    renderObject.fillOut(vertices, colors, texCoords, normals);
}

function drawTexturedCube(renderObject, offsetX, offsetY, offsetZ, width, height, length, color, texCoords){
    color = color || [1, 1, 1, 1];
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    
    if(texCoords == undefined){
        texCoords = new Array(0);
        for(var i = 0; i < 6; i++) {
            texCoords.push([0, 1]);
            texCoords.push([0, 0]);
            texCoords.push([1, 0]);
            texCoords.push([1, 1]);
        }
    }
    
    var vertices = [
        //Front
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length,
        
        //Back
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX, offsetY+height, offsetZ,
        
        //Left
        offsetX, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        
        //Right
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        
        //Down
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ+length,
        
        //Up
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length
    ];
    var texCoords2 = new Array(0);
    
    for(var i = 0; i < 6; i++) {
        texCoords2.push(texCoords[i*4][0]);
        texCoords2.push(texCoords[i*4][1]);
        
        texCoords2.push(texCoords[i*4+3][0]);
        texCoords2.push(texCoords[i*4+3][1]);
        
        texCoords2.push(texCoords[i*4+1][0]);
        texCoords2.push(texCoords[i*4+1][1]);
        
        texCoords2.push(texCoords[i*4+1][0]);
        texCoords2.push(texCoords[i*4+1][1]);
        
        texCoords2.push(texCoords[i*4+3][0]);
        texCoords2.push(texCoords[i*4+3][1]);
        
        texCoords2.push(texCoords[i*4+2][0]);
        texCoords2.push(texCoords[i*4+2][1]);
    }
    
    var colors = [color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3],
				color[0],color[1],color[2],color[3]];
    var colors = new Array();
	for(var i = 0; i < 6*6; i++) {
		colors.push(color[0]);
		colors.push(color[1]);
        colors.push(color[2]);
        colors.push(color[3]);
	}
    
    var normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];
    
    renderObject.fillOut(vertices, colors, texCoords2, normals);
}