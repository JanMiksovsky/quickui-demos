module.exports = function(grunt) {

    grunt.loadNpmTasks( "grunt-contrib-coffee" );
    grunt.loadNpmTasks( "grunt-contrib-less" );

    var sortDependencies = require( "sort-dependencies" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            controls: {
                src: sortDependencies.sortFiles( "controls/*.coffee" ),
                dest: "dateRangeCalendar.js",
                options: { bare: false }
            }
        },
        less: {
            controls: {
                files: {
                    "dateRangeCalendar.css": sortDependencies.sortFiles( "controls/*.less" ),
                }
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee less" );
    
};
