/*
 * Grunt file to build the QuickUI Catalog.
 *
 * This has to encompass two separate build systems: one for new controls built
 * with CoffeeScript + LESS, and one for older controls built with QuickUI
 * Markup (http://github.com/JanMiksovsky/quickui-markup). Both types of
 * controls are built separate, and the output of both are then combined.
 */

module.exports = function(grunt) {

    grunt.loadNpmTasks( "grunt-contrib-coffee" );
    grunt.loadNpmTasks( "grunt-contrib-less" );

    var sortDependencies = require( "sort-dependencies" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            controls: {
                src: sortDependencies.sortFiles( "controls/*.coffee" ),
                dest: "kanjiCalendar.js",
                options: { bare: false }
            }
        },
        less: {
            controls: {
                files: {
                    "kanjiCalendar.css": sortDependencies.sortFiles( "controls/*.less" ),
                }
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee less" );
    
};
