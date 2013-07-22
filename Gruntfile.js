module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {},
                files: {
                    "tmp/css/main.css": "src/css/main.less"
        }}},
        uglify: {
            build: {
                src: 'tmp/js/banner.js',
                dest: 'build/banner.min.js'
        }},
        copy: {
            development: {
                files: [
                    {expand: true, cwd: 'src/', src: ['*.html'], dest: 'build/'},
                    {expand: true, cwd: 'src/img/', src: ['*'], dest: 'tmp/img/'},
                    ]
        }},
        imageEmbed: {
            dist: {
                src: [ "tmp/css/main.css" ],
                dest: "build/dothiv.css",
            options: {
                deleteAfterEncoding : false
            }
        }},
        cssmin: {
            minify: {
                src: ['build/dothiv.css'],
                dest: 'build/dothiv.css',
            }
        },
        includereplace: {
            dist: {
                files: [{expand: true, cwd: 'src/', src: ['js/banner.js'], dest: 'tmp/'}]
        }},
    });

    // Load the plugin that provides the "less" task.
    grunt.loadNpmTasks('grunt-contrib-less');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "copy" task.
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Load the plugin that provides the "imageEmbed" task.
    grunt.loadNpmTasks("grunt-image-embed");

    // Load the plugin that provides the "cssmin" task.
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Load the plugin that provides the "includereplace" task.
    grunt.loadNpmTasks('grunt-include-replace');

    // Default tasks.
    grunt.registerTask('default', ['less','includereplace','uglify','copy','imageEmbed','cssmin']);
};
