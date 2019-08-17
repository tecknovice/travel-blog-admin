const path = require('path');
const mozjpeg = require('imagemin-mozjpeg');
const debug = require('debug')('travel-blog-admin:grunt')
const source = path.join(__dirname,'public','images','/')
const dest = path.join(__dirname,'public','grunt','images','/') 
const files = source + '*.{png,jpg,jpeg,gif}'
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imagemin: {                          // Task
            dynamic: {                         // Another target
                options: {                       // Target options
                    optimizationLevel: 2,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()],
                    progressive: true,
                    cache: false
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd:  source,                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,jpeg,gif}'],   // Actual patterns to match
                    dest:  dest                  // Destination path prefix
                }]
            }
        },
        watch: {
            files: [files],
            tasks: ['imagemin']
          }
        

    });

    debug('files',files)

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['imagemin', 'watch']);
};