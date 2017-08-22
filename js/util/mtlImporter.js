var MtlImporter = {
    getMtls: function(text) {
        var objects = [];
        
        var name = "";
        var textures = new Array(0);
        
        var lines = text.split("\n");
        for(var l = 0; l < lines.length; l++) {
            var elements = lines[l].split(" ");
            if(elements[0] == "newmtl") {
                name = elements[1];
            }else if(elements[0] == "map_Kd") {
                objects[name] = "res/"+elements[1];
            }
        }
        console.log(objects);
        return objects;
	}
};