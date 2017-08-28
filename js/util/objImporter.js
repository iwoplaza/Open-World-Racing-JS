var ObjLoadQueue = new Array(0);
var ModelLib = new Array(0);
var MtlLib = new Array(0);
var ObjImporter = {
    buffer: new Array(0),
    importModel: function(name){
        registerObj(name+".obj");
    },
    getModel: function(text) {
        var Model = {};
        var group = "noGroup";
        var name = "";
        var mtl = "";
        
        var groups = true;
		
        var positions = new Array(0);
        var norms = new Array(0);
        var texs = new Array(0);
        
        var vertices = new Array(0);
        var colors = new Array(0);
        var texCoords = new Array(0);
        var normals = new Array(0);
        
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
                    for(var i = 0; i < vertices.length/3*4; i++) colors.push(1);
                    for(var i = 0; i < vertices.length/3*2; i++) texCoords.push(0);
                    
                    var x = {min: vertices[0], max: vertices[0]};
                    var y = {min: vertices[1], max: vertices[1]};
                    var z = {min: vertices[2], max: vertices[2]};
                    for (var i=0;i<vertices.length;i+=3){
                        x.min = ((vertices[i]<x.min)?(vertices[i]):(x.min));
                        x.max = ((vertices[i]>x.max)?(vertices[i]):(x.max));
                        y.min = ((vertices[i+1]<y.min)?(vertices[i+1]):(y.min));
                        y.max = ((vertices[i+1]>y.max)?(vertices[i+1]):(y.max));
                        z.min = ((vertices[i+2]<z.min)?(vertices[i+2]):(z.min));
                        z.max = ((vertices[i+2]>z.max)?(vertices[i+2]):(z.max));
                    }
                    x = (x.min+x.max)/2;
                    y = (y.min+y.max)/2;
                    z = (z.min+z.max)/2;
                    for (var i=0;i<vertices.length;i+=3){
                        vertices[i] -= x;
                        vertices[i+1] -= y;
                        vertices[i+2] -= z;
                    }
                    
                    Model[group][name] = {mesh: new Mesh(), mtl: mtl, offset: [x, y, z], rotation: {x: 0, y: 0, z: 0}};
                    Model[group][name].mesh.fillOut(Object.create(vertices), Object.create(colors), Object.create(texCoords), Object.create(normals));
                    vertices = [];
                    colors = [];
                    normals = [];
                    texCoords = [];
                }
                if (elements[1].split(":").length>1){
                    group = elements[1].split(":")[0];
                    name = elements[1].split(":")[1];
                }else{
                    name = elements[1];
                }
                if (Model[group]==undefined) Model[group] = [];
                
            }else if(elements[0] == "usemtl"){
                mtl = elements[1];
            }else if(elements[0] == "mtllib"){
                Model.mtllib = elements[1];
            }
        }
        for(var i = 0; i < vertices.length/3*4; i++) colors.push(1);
        for(var i = 0; i < vertices.length/3*2; i++) texCoords.push(0);
        
        var x = {min: vertices[0], max: vertices[0]};
        var y = {min: vertices[1], max: vertices[1]};
        var z = {min: vertices[2], max: vertices[2]};
        
        for (var i=0;i<vertices.length;i+=3){
            x.min = ((vertices[i]<x.min)?(vertices[i]):(x.min));
            x.max = ((vertices[i]>x.max)?(vertices[i]):(x.max));
            y.min = ((vertices[i+1]<y.min)?(vertices[i+1]):(y.min));
            y.max = ((vertices[i+1]>y.max)?(vertices[i+1]):(y.max));
            z.min = ((vertices[i+2]<z.min)?(vertices[i+2]):(z.min));
            z.max = ((vertices[i+2]>z.max)?(vertices[i+2]):(z.max));
        }
        x = (x.min+x.max)/2;
        y = (y.min+y.max)/2;
        z = (z.min+z.max)/2;
        for (var i=0;i<vertices.length;i+=3){
            vertices[i] -= x;
            vertices[i+1] -= y;
            vertices[i+2] -= z;
        }
        
        Model[group][name] = {mesh: new Mesh(), mtl: mtl, offset: [x, y, z], rotation: {x: 0, y: 0, z: 0}};
        Model[group][name].mesh.fillOut(vertices, colors, texCoords, normals);
        return Model;
	},
    getMtllib: function(resourceManager, text) {
        var MtlLib = new Array(0);
        var name = "";
        
        var lines = text.split("\n");
        for(var l = 0; l < lines.length; l++) {
            var elements = lines[l].split(" ");
            if(elements[0] == "newmtl") {
                name = elements[1];
                MtlLib[name] = new Object;
            }else if(elements[0] == "map_Kd") {
                MtlLib[name].texture = elements[1];
                if (elements[1] != "."){
                    TextureManager.loadResource(resourceManager, elements[1]);
                }
            }
        }
        
        return MtlLib;
	},
    loadModel: function(resourceManager, path) {
        if(ModelLib[path] != undefined)
            return;
        
        resourceManager.addTask();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
                ModelLib[path] = ObjImporter.getModel(xmlhttp.responseText);
                if (ModelLib[path].mtllib!=undefined) ObjImporter.loadMtllib(resourceManager, ModelLib[path].mtllib);
                resourceManager.releaseTask();
            }
        }
        xmlhttp.open("GET", ResourceManager.prototype.RESOURCE_PATH+path, true);
        xmlhttp.send();
    },
    loadMtllib: function(resourceManager, name){
        resourceManager.addTask();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
                MtlLib[name] = ObjImporter.getMtllib(resourceManager, xmlhttp.responseText);
                resourceManager.releaseTask();
            }
        }
        xmlhttp.open("GET",ResourceManager.prototype.RESOURCE_PATH+name, true);
        xmlhttp.send();
    },
    registerObj: function(name){
        ObjLoadQueue.push(name);
        return name;    
    },
    loadModels: function(resourceManager){
        while (ObjLoadQueue.length>0){
            this.loadModel(resourceManager, ObjLoadQueue.pop());
        }
    },
    load: function(resourceManager){
        this.loadModels(resourceManager);
    }
};