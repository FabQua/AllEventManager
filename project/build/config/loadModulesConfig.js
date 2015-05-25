module.exports = function (grunt) {
    grunt.log.writeln("Grunt.config: loadModules");
    
    var path = require("path");
    var baseDir = "../../src/";
    var modules = require("include-all")({
        dirname: path.resolve(__dirname, baseDir)
    });
    grunt.config.set("modules", modules);
};