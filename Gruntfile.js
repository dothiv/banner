module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {},
                files: {
                    "tmp/css/iframe.css": "src/css/iframe.less",
                    "tmp/css/banner-center.css": "src/css/banner-center.less"
        }}},
        uglify: {
            libs: {
                files: [{expand: true, cwd: 'tmp/', src: ['js/domready.js', 'js/json2.js'], dest: 'tmp/'}]
            },
            internal: {
                src: 'tmp/js/banner-center.js',
                dest: 'tmp/js/banner-center.js'
            },
            external: {
                src: 'tmp/js/banner.js',
                dest: 'build/banner.min.js'
        }},
        copy: {
            development: {
                files: [
                    {expand: true, cwd: 'src/', src: ['page.html'], dest: 'build/'},
                    {expand: true, cwd: 'src/', src: ['data.json'], dest: 'build/'},
                    {expand: true, cwd: 'src/', src: ['banner-*.html'], dest: 'tmp/'},
                    {expand: true, cwd: 'src/img/', src: ['*'], dest: 'tmp/img/'},
                    {expand: true, cwd: 'src/js/', src: ['*'], dest: 'tmp/js/'},
                    ]
        }},
        imageEmbed: {
            dist: {
                files: [
                    {expand: true, cwd: 'tmp/', src: ['css/*.css'], dest: 'tmp/'},
                ]},
            options: {
                deleteAfterEncoding : false
       }},
        cssmin: {
            minify: {
                files: [
                    {expand: true, cwd: 'tmp/', src: ['css/*.css'], dest: 'tmp/'},
                ]
            }
        },
        includereplace: {
            internal: {
                files: [{expand: true, cwd: 'tmp/', src: ['js/banner-center.js'], dest: 'tmp/'}]
            },
            external: {
                files: [
                    {expand: true, cwd: 'tmp/', src: ['js/banner.js'], dest: 'tmp/'},
                    {expand: true, cwd: 'tmp/', src: ['banner-*.html'], dest: 'tmp/'},
                    ]
        }},
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
              },
                files: [
                    {expand: true, cwd: 'tmp/', src: ['banner-*.html'], dest: 'build/'},
                ]
        }},
        clean: ['tmp/','build/']
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

    // Load the plugin that provides the "htmlmin" task.
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Load the plugin that provides the "clean" task.
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default tasks.
    grunt.registerTask('default', ['clean','less','copy','imageEmbed','cssmin','uglify:libs','includereplace:internal','uglify:internal','includereplace:external','htmlmin','uglify:external']);
};
