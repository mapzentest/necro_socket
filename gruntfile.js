module.exports = function(grunt) {
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
            typings: {
                install: {}
            },
            tslint: {
                options: {
                    configuration: 'tslint.json'
                },
                files: {
                    src: ['src/**/*.ts']
                }
            },
            sass: {
                dist: { // Target
                    options: {
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
            'typings',
            'sass',
            'ts',
            'tslint'
        ])
        grunt.registerTask('dev', [
            'typings',
            'sass',
            'ts',
            'tslint',
            'watch'
        ])

        // grunt.registerTask("default", ["ts"])
    }
    // https://github.com/TypeStrong/grunt-ts/tree/master/sample