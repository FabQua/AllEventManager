"use strict";
module.exports = function (grunt) {
    grunt.log.writeln("AllEventManager: Starting Grunt");
    grunt.log.writeln("Grunt.read: package.json");
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json")
    });
    
    grunt.log.writeln("Grunt.require: include-all");
    var includeAll = require("include-all");
    grunt.log.writeln("Grunt.require: path");
    var path = require("path");
    
    function loadTasks(relPath) {
        return includeAll({
            dirname: path.resolve(__dirname, relPath),
            filter: /(.+)\.js/
        }) || {};
    }
    
    function invokeConfigFnc(tasks) {
        for (var taskName in tasks) {
            if(tasks.hasOwnProperty(taskName)) {
                tasks[taskName](grunt);
            }
        }
    }
    
    grunt.log.writeln("Grunt.loadTasks: project/build/config");
    var configs = loadTasks("project/build/config");
    
    grunt.log.writeln("Grunt.invokeTasks: project/build/config");
    invokeConfigFnc(configs);
    
    grunt.log.writeln("Grunt.loadTasks: project/build/task");
    var tasks = loadTasks("project/build/task");
    
    grunt.log.writeln("Grunt.invokeTasks: project/build/task");
    invokeConfigFnc(tasks);
};
