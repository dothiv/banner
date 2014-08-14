module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            default: {
                options: {},
                files: {
                    "tmp/css/clickcounter/top.css": "tmp/lesscss/clickcounter/top.less",
                    "tmp/css/clickcounter/bottom.css": "tmp/lesscss/clickcounter/bottom.less",
                    "tmp/css/clickcounter/left.css": "tmp/lesscss/clickcounter/left.less",
                    "tmp/css/clickcounter/right.css": "tmp/lesscss/clickcounter/right.less"
                }
            }
        },
        includereplace: {
            options: {
                prefix: '{{',
                suffix: '}}',
                includesDir: 'tmp/',
                globals: {
                    'topbottom-width': 500,
                    'topbottom-height': 110,
                    'leftright-width': 290,
                    'leftright-height': 160,
                    'shadow-size': 20
                }
            },
            assets: {
                files: [
                    {expand: true, cwd: 'src/js/clickcounter/', src: ['*.js'], dest: 'tmp/js/clickcounter/'},
                    {expand: true, cwd: 'src/lesscss/clickcounter/', src: ['*.less'], dest: 'tmp/lesscss/clickcounter/'}
                ]
            },
            html: {
                files: [
                    {expand: true, cwd: 'src/', src: ['clickcounter-*.html'], dest: 'build/'}
                ]
            }
        },
        uglify: {
            libs: {
                files: [
                    {expand: true, cwd: 'vendor/', src: ['*.js'], dest: 'tmp/vendor/'}
                ]
            },
            src: {
                files: [
                    {expand: true, cwd: 'tmp/js/', src: ['*/*.js'], dest: 'tmp/js/'}
                ]
            }
        },
        clean: ['tmp/', 'build/']
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default tasks.
    grunt.registerTask('default', ['clean', 'uglify:libs', 'includereplace:assets', 'less', 'includereplace:html']);

    // Debug tasks.
    grunt.registerTask('develop', ['clean', 'uglify:libs', 'includereplace:assets', 'less', 'includereplace:html']);
};
