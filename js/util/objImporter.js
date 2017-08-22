var ObjImporter = {
    getMeshes: function(text, mtllib) {
        var objects = [];
        
        var name = "";
		
        var positions = new Array(0);
        var norms = new Array(0);
        var texs = new Array(0);
        
        var vertices = new Array(0);
        var colors = new Array(0);
        var texCoords = new Array(0);
        var normals = new Array(0);
        
        var textures = new Array(0);
        
        var lines = text.split("\n");
        for(var l = 0; l < lines.length; l++) {
            var elements = lines[l].split(" ");
            if(elements[0] == "v") {
                positions.push(parseFloat(elements[1]));
                positions.push(parseFloat(elements[2]));
                positions.push(parseFloat(elements[3]));
            }else if(elements[0] == "vn") {
                norms.push(parseFloat(elements[1]));
                norms.push(parseFloat(elements[2]));
                norms.push(parseFloat(elements[3]));
            }else if(elements[0] == "vt"){
                texs.push(parseFloat(elements[1]));
                texs.push(parseFloat(elements[2]));
            }else if(elements[0] == "f") {
                for (var i=1;i<=3;i++){
                    var points = elements[i].split("/");
                    vertices.push(positions[(parseInt(points[0])-1)*3]);
                    vertices.push(positions[(parseInt(points[0])-1)*3+1]);
                    vertices.push(positions[(parseInt(points[0])-1)*3+2]);
                    texCoords.push(texs[(parseInt(points[1])-1)*2]);
                    texCoords.push(1-texs[(parseInt(points[1])-1)*2+1]);
                    normals.push(norms[(parseInt(points[2])-1)*3]);
                    normals.push(norms[(parseInt(points[2])-1)*3+1]);
                    normals.push(norms[(parseInt(points[2])-1)*3+2]);
                }
            }else if(elements[0] == "o") {
                //If an object was defined before, store all the information in the array with that name.
                if (name != "") {
                    objects[name] = [new Mesh(), this.textures];
                    for(var i = 0; i < vertices.length/3*4; i++) colors.push(1);
                    for(var i = 0; i < vertices.length/3*2; i++) texCoords.push(0);
                    objects[name][0].fillOut(Object.create(vertices), Object.create(colors), Object.create(texCoords), Object.create(normals));
                    vertices = [];
                    colors = [];
                    normals = [];
                    texCoords = [];
                }
                name = elements[1];
            }else if(elements[0] == "usemtl"){
                this.textures = mtllib[elements[1]];
            }
        }
        objects[name] = [new Mesh(), this.textures];
        for(var i = 0; i < vertices.length/3*4; i++) colors.push(1);
        for(var i = 0; i < vertices.length/3*2; i++) texCoords.push(0);
        objects[name][0].fillOut(vertices, colors, texCoords, normals);
        
        return objects;
	}
};