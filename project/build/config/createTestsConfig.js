module.exports = function(grunt) {
    grunt.log.writeln("Grunt.config: createTests");
    
    grunt.config.set("createtests", {
        src: "../test",
        dst: "test/unit"
    });
};