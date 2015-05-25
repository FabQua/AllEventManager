module.exports = function(grunt) {
    grunt.log.writeln("Grunt.config: karma");
    
    grunt.config.set("karma", {
        unit: {
            configFile: "karma.conf.js"
        }
    });
};