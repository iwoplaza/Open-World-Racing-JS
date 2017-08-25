var ScriptManager = {
    database: [],
    
    register: function(path, script) {
        this.database[path] = script;
    },
    
    get: function(path) {
        return this.database[path];
    }
};