/*
 * Grunt file to build the QuickUI Catalog.
 *
 * This has to encompass two separate build systems: one for new controls built
 * with CoffeeScript + LESS, and one for older controls built with QuickUI
 * Markup (http://github.com/JanMiksovsky/quickui-markup). Both types of
 * controls are built separate, and the output of both are then combined.
 */

module.exports = function(grunt) {

    grunt.loadTasks( "../../quickui/grunt" );
    grunt.loadNpmTasks( "grunt-contrib-less" );

    var sortDependencies = require( "../../quickui/grunt/sortDependencies.js" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            controls: {
                src: sortDependencies.sortClassFiles( "controls/*.coffee" ),
                dest: "kanjiCalendar.js",
                options: { bare: false }
            }
        },
        less: {
            controls: {
                files: {
                    "kanjiCalendar.css": sortDependencies.sortClassFiles( "controls/*.less" ),
                }
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee less" );
    
};
