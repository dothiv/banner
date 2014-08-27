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
                    "tmp/css/clickcounter/topleft-micro.css": "tmp/lesscss/clickcounter/topleft-micro.less",
                    "tmp/css/clickcounter/topright-micro.css": "tmp/lesscss/clickcounter/topright-micro.less",
                    "tmp/css/clickcounter/top-micro.css": "tmp/lesscss/clickcounter/top-micro.less",
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
                    'premium-width': 600,
                    'leftright-width': 290,
                    'shadow-size': 20,
                    'pinkbar-height': 40,
                    'pinkbar-margin': 15,
                    'animation-overflow': 100,
                    'icon-size': 44,
                    'headline-fontsize': 22,
                    'headline-fontsize-micro': 18,
                    'text-fontsize': 14,
                    'color-font': '#000',
                    'color-bg': '#fff',
                    'color-pinkbar': '#E00073',
                    'color-overlay': '#000000',
                    'reshow-after': 60 * 30,
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
                    globals: {
                        'reshow-after': 0,
                        'develop': '1',
                        'config-url': grunt.option('config-url') || '//localhost/develop/demo.json',
                        'html-folder-url': grunt.option('html-folder-url') || '//localhost/build'
                    }
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
            clickcounter: {
                files: [
                    {expand: true, cwd: 'tmp/js/', src: ['*/*.js'], dest: 'tmp/js/'}
                ]
            },
            iframe: {
                files: [
                    {'build/clickcounter.min.js': 'tmp/js/iframe.js'}
                ]
            }
        },
        copy: {
            common:  {
                files: [
                    {expand: true, cwd: 'src/img/', src: ['*'], dest: 'tmp/img/'}
                ]
            }
        },
        cssmin: {
            iframe: {
                expand: true,
                cwd: 'tmp/css/',
                src: ['*.css'],
                dest: 'tmp/css/',
                ext: '.css'
            },
            clickcounter: {
                expand: true,
                cwd: 'tmp/css/clickcounter/',
                src: ['*.css'],
                dest: 'tmp/css/clickcounter/',
                ext: '.css'
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
    grunt.registerTask('default', ['clean', 'copy:common', 'uglify:libs', 'includereplace:less', 'less', 'cssmin:iframe', 'cssmin:clickcounter', 'includereplace:js', 'uglify:clickcounter', 'includereplace:html', 'uglify:iframe']);

    // Debug tasks.
    grunt.registerTask('develop', ['clean', 'copy:common', 'uglify:libs', 'includereplace:less', 'less', 'cssmin:iframe', 'cssmin:clickcounter', 'includereplace:js@develop', 'uglify:clickcounter', 'includereplace:html', 'uglify:iframe']);
};
