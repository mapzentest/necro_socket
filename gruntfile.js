module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      client : {
        src: ["typings/*","client/*/*.ts", "!node_modules/**"],
        out:'dist/client/scripts/site.js'
      },
      server : {
        src: ["typings/*","server/**/*.ts", "!node_modules/**"],
        out:'dist/server/app.js'
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