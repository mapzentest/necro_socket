module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      client : {
        src: ["client/*/*.ts", "!node_modules/**"],
        out:'dist/client/scripts/site.js'
      },
      server : {
        src: ["server/**/*.ts", "!node_modules/**"],
        out:'dist/server/app.js'
      }
    }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};
//https://github.com/TypeStrong/grunt-ts/tree/master/sample