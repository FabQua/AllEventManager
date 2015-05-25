module.exports = function (grunt) {
    grunt.registerTask("createtests", "Creating test specifications", function () {
        grunt.config.requires("createtests.src");
        grunt.config.requires("createtests.dst");
        
        var modules = grunt.config.get("modules");
        var testConfig = grunt.config.get("createtests");
        var _regex = {
            require: /require\s*[(]".+"[)]/m,
            requirePre: /require\s*[(]"/,
            requirePost: /("[)])$/,
            pathSrc: /.*src\//
        };
        var tests = require("include-all")({
            dirname: require("path").resolve(__dirname, testConfig.src),
            markDirekctories: true
        });

        function writeTest(test, filename) {
            if (test.isDirectory) {
                for (var prop in test) {
                    if (test.hasOwnProperty(prop)) {
                        writeTest(test[prop]);
                    }
                }
            } else {
                var testCode = test.toString();
                var reqVar = _regex.require.exec(testCode);

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
                    testCode = testCode.replace(reqVar[0], module.toString());

                    reqVar = _regex.require.exec(testCode);
                }

                grunt.file.write(testConfig.dst + "/" + filename.replace(".js", ".spec.js"), "(" + testCode + ")();");
            }
        }
        ;

        for (var name in tests) {
            if (tests.hasOwnProperty(name)) {
                writeTest(tests[name], name);
            }
        }
    });
};