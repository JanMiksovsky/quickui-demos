module.exports = function(grunt) {

    grunt.loadNpmTasks( "grunt-contrib-concat" );

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON( "package.json" ),
        concat: {
            js: {
                src: [ "demo/*.js" ],
                dest: "MaxSquareDemo.js"
            },
            css: {
                src: [ "demo/*.css" ],
                dest: "MaxSquareDemo.css"
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", [ "concat" ] );
    
};
