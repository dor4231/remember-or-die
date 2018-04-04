module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        responsive_images: {
            dev: {
                options: {
                    sizes: [
                        {
                            name: "small",
                            width: 640,
                            quality: 60
                        },
                        {
                            name: "medium",
                            width: 1000,
                            quality: 60
                        },
                        {
                            name: "large",
                            width: 1600,
                            quality: 60
                        }
                    ]
                }, files: [{
                    expand: true,
                    src: ['**.{jpg,gif,png}'],
                    cwd: 'assets/src/',
                    dest: 'assets/images/'
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-responsive-images');

    // Default task(s).
    grunt.registerTask('default', ['responsive_images']);

};