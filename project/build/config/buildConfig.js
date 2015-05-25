module.exports = function(grunt) {
    grunt.log.writeln("Grunt.config: build");
    grunt.config.set("build", {
        src: "../dist",
        dst: "dist"
    });
};