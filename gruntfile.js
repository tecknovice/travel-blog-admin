const mozjpeg = require('imagemin-mozjpeg');

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
                    cwd: './public/images/',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,jpeg,gif}'],   // Actual patterns to match
                    dest: './public/grunt/images/'                  // Destination path prefix
                }]
            }
        },
        watch: {
            files: 'public/images/*.{png,jpg,jpeg,gif}',
            tasks: ['imagemin']
          }
        

    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['imagemin', 'watch']);
};