module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      app : {
        src: ["typings/*","app/**/*.ts", "!node_modules/**"],
        options: {
          module: "commonjs",
          noLib: true,
          target: "es6",
          sourceMap: false
        }
      }
    },

   tslint: {
      options: {
        configuration: "tslint.json"
      },
      files: {
        src: ["src/**/*.ts"]
      }
    },
    watch: {
      ts: {
        files: ["js/src/**/*.ts", "src/**/*.ts"],
        tasks: ["ts", "tslint"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");

  grunt.registerTask("default", [
    "ts",
    "tslint"
  ]);
  //grunt.registerTask("default", ["ts"]);
};
//https://github.com/TypeStrong/grunt-ts/tree/master/sample