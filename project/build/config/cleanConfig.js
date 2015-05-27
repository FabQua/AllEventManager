module.exports = function(grunt) {
    grunt.log.writeln("Grunt.config: clean");
    grunt.config.set("clean", {
        test: ["test/unit"],
        dist: ["dist"]
    });
};