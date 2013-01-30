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
        var cellSize = maxSquare.optimalCellSize( this.width(), this.height(), $children.length );
        $children.css( cellSize );
    }

});
