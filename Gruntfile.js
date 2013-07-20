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
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/js/banner.js',
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

    // Default tasks.
    grunt.registerTask('default', ['less','uglify','copy','imageEmbed','cssmin']);
};
