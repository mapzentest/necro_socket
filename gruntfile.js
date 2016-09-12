module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      client : {
        src: ["**/client/*.ts", "!node_modules/**"],
        out:'dist/scripts/client.js'
      },
      client : {
        src: ["**/server/*.ts", "!node_modules/**"],
        out:'dist/scripts/server.js'
      }
    }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};
//https://github.com/TypeStrong/grunt-ts/tree/master/sample