var MaxSquareGrid = Control.sub({

    className: "MaxSquareGrid",

    content: function( content ) {
        var result = this._super( content );
        if ( content !== undefined ) {
            this._refresh();
        }
        return result;
    },

    initialize: function() {
        var self = this;
        this.on( "layout", function() {
            self._refresh();
        });
    },

    // An array of URLs pointing to images.
    photos: Control.property( function( photos ) {
        var photoElements = $.map(photos, function( photo ) {
            return Photo.create({
                src: photo.src,
                href: photo.href
            });
        });
        this.content( photoElements );
    }),

    _refresh: function() {
        var $children = this.children();
        // Leave a margin of unused space on the right. If the user is making
        // the window narrower, a fast browser will reflow the content before
        // the grid has a chance to refresh the cell size, producing significant
        // flicker. By leaving a bit of room on the right, we give ourselves a
        // chance to detect a grid resize and reduce the size of the cells
        // before the browser can reflow the content.
        var width = this.width() - 25;
        var cellSize = maxSquare.optimalCellSize( width, this.height(), $children.length );
        $children.css( cellSize );
    }

});
