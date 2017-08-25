var SceneLoader = {
    loadResource: function(resourceManager, name) {
        resourceManager.addTask();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
                SceneLoader.loadFromString(resourceManager, xmlhttp.responseText);
                resourceManager.releaseTask();
            }
        }
        xmlhttp.open("GET","res/scenes/"+name+".json",true);
        xmlhttp.send();
    },
    
    loadFromString: function(resourceManager, code) {
        var jsonData = JSON.parse(code);
        
        var shadersToLoad = [];
        var modelsToLoad = [];
        
        SceneManager.current = new Scene(jsonData.name);
        var objects = jsonData.objects;
        for(let o in objects) {
            let object = objects[o];
            var gameObject = new GameObject(object.name);
            if(object.needsUpdates) gameObject.markUpdatable();
            if(object.location) gameObject.setLocation(object.location[0], object.location[1], object.location[2]);
            for(let g in object.components) {
                let componentGroup = object.components[g];
                for(let c in componentGroup) {
                    var componentNode = componentGroup[c];
                    var componentType = Components.componentTypes[g];
                    var component = new componentType;
                    for(let p in componentNode) {
                        component[p] = componentNode[p];
                        if(p == "shader") {
                            shadersToLoad.push(componentNode[p]);
                        }else if(p == "modelName") {
                            modelsToLoad.push(componentNode[p]);
                        }
                    }
                    gameObject.addComponent(component);
                }
            }
            SceneManager.current.addGameObject(gameObject);
        }
        
        //Load necessary shaders
        for(var i in shadersToLoad) {
            ShaderManager.loadResource(resourceManager, shadersToLoad[i]);
        }
        
        //Load necessary models
        for(var i in modelsToLoad) {
            ObjImporter.loadModel(resourceManager, modelsToLoad[i]);
        }
    }
};