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
                    "tmp/css/clickcounter/right.css": "tmp/lesscss/clickcounter/right.less",
                    "tmp/css/clickcounter/premium.css": "tmp/lesscss/clickcounter/premium.less",
                    "tmp/css/iframe.css": "tmp/lesscss/iframe/iframe.less"
                }
            }
        },
        includereplace: {
            options: {
                prefix: '{{',
                suffix: '}}',
                globals: {
                    'topbottom-width': 500,
                    'topbottom-height': 110,
                    'leftright-width': 290,
                    'leftright-height': 160,
                    'shadow-size': 20,
                    'pinkbar-height': 40,
                    'pinkbar-margin': 15,
                    'animation-overflow': 100,
                    'color-pinkbar': '#E00073',
                    'color-pinkbar-alt': '#FCE5F1',
                    'develop': '0'
                }
            },
            less: {
                options: {
                    includesDir: 'tmp/lesscss/'
                },
                files: [
                    {expand: true, cwd: 'src/lesscss/', src: ['*/*.less'], dest: 'tmp/lesscss/'},
                    {expand: true, cwd: 'src/lesscss/', src: ['*.less'], dest: 'tmp/lesscss/'}
                ]
            },
            js: {
                options: {
                    includesDir: 'tmp/js/'
                },
                files: [
                    {expand: true, cwd: 'src/js/', src: ['*/*.js'], dest: 'tmp/js/'},
                    {expand: true, cwd: 'src/js/', src: ['*.js'], dest: 'tmp/js/'}
                ]
            },
            'js@develop': {
                options: {
                    includesDir: 'tmp/js/',
                    'develop': '1'
                },
                files: [
                    {expand: true, cwd: 'src/js/', src: ['*/*.js'], dest: 'tmp/js/'},
                    {expand: true, cwd: 'src/js/', src: ['*.js'], dest: 'tmp/js/'}
                ]
            },
            html: {
                options: {
                    includesDir: 'tmp/'
                },
                files: [
                    {expand: true, cwd: 'src/partial/', src: ['*.html'], dest: 'tmp/partial/'},
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
        copy: {
            develop: {
                files: [
                    {'build/iframe.js': 'tmp/js/iframe.js'}
                ]
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'tmp/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'tmp/css/',
                ext: '.min.css'
            }
        },
        clean: ['tmp/', 'build/']
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default tasks.
    grunt.registerTask('default', ['clean', 'uglify:libs', 'includereplace:less', 'less', 'cssmin', 'includereplace:js', 'includereplace:html']);

    // Debug tasks.
    grunt.registerTask('develop', ['clean', 'uglify:libs', 'includereplace:less', 'less', 'cssmin', 'includereplace:js@develop', 'includereplace:html', 'copy:develop']);
};
