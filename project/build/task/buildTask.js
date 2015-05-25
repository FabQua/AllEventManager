module.exports = function (grunt) {
    grunt.registerTask("build", "Creating test specifications", function () {
        grunt.config.requires("build.src");
        grunt.config.requires("build.dst");
        
        var modules = grunt.config.get("modules");
        var buildConfig = grunt.config.get("build");
        var _regex = {
            require: /require\s*[(]".+"[)]/m,
            requirePre: /require\s*[(]"/,
            requirePost: /("[)])$/,
            pathSrc: /.*src\//
        };
        var builds = require("include-all")({
            dirname: require("path").resolve(__dirname, buildConfig.src),
            markDirekctories: true
        });

        function writeBuild(build, filename) {
            if (build.isDirectory) {
                for (var prop in build) {
                    if (build.hasOwnProperty(prop)) {
                        writeBuild(build[prop]);
                    }
                }
            } else {
                var buildCode = build.toString();
                var reqVar = _regex.require.exec(buildCode);

                while (reqVar && reqVar[0]) {
                    var reqString = reqVar[0];
                    var modulePath = reqString.replace(_regex.requirePre, "")
                            .replace(_regex.requirePost, "")
                            .replace(_regex.pathSrc, "");
                    var moduleArray = modulePath.split("/");
                    var module = modules[moduleArray.shift()];

                    while (moduleArray.length > 0) {
                        module = module[moduleArray.shift()];
                    }
                    buildCode = buildCode.replace(reqVar[0], module.toString());

                    reqVar = _regex.require.exec(buildCode);
                }
                
                var className = filename.replace(/(\.js)$/, "");
                grunt.file.write(buildConfig.dst + "/" + filename.toLowerCase(), "var " + className + " = (" + buildCode + ")();");
            }
        };

        for (var name in builds) {
            if (builds.hasOwnProperty(name)) {
                writeBuild(builds[name], name);
            }
        }
    });
};