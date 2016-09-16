module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    ts: {
      app: {
        src: ['typings/*', 'app/**/*.ts', '!node_modules/**'],
        options: {
          module: 'commonjs',
          noLib: true,
          target: 'es6',
          sourceMap: false
        }
      }
    },

    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      files: {
        src: ['src/**/*.ts']
      }
    },
    sass: { // Task
      dist: { // Target
        options: { // Target options
          // style: 'expanded',
          sourceMap: true
        },
        files: { // Dictionary of files
          'app/www/styles/ui.css': 'app/www/styles/ui.scss', // 'destination': 'source'
        }
      }
    },
    watch: {
      ts: {
        files: ['app/**/*.ts'],
        tasks: ['ts', 'tslint']
      },
      sass: {
        files: ['app/**/*.scss'],
        tasks: ['sass']
      }
    }
  })

  grunt.registerTask('default', [
    'sass',
    'ts',
    'tslint'
  ])
// grunt.registerTask("default", ["ts"])
}
// https://github.com/TypeStrong/grunt-ts/tree/master/sample
