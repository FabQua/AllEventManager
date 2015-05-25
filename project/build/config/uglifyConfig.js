module.exports = function(grunt) {
    grunt.log.writeln("Grunt.config: uglify");
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.config.set("uglify", {
        build: {
            files: {
                "dist/alleventmanager.min.js": ["dist/alleventmanager.js"]
            }
        }
    });
};