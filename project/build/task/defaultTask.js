module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-contrib-clean");
    
    grunt.registerTask("test", ["clean:test", "createtests", "karma"]);
    grunt.registerTask("dist", ["clean:dist", "build", "uglify"]);
    grunt.registerTask("default", ["clean", "createtests", "karma", "build", "uglify"]);
};