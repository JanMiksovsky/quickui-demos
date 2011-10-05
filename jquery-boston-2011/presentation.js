/*
 * Simple PowerPoint-style presentation. 
 */

/*
 * Constructor expects an array of strings representing names of control classes
 * which serve as the slides.
 */
function Presentation( slides ) {
    
    this._slides = slides;
    
    var self = this;
    $( document ).bind({
        "previousSlide": function() {
            self.previousSlide();
        },
        "nextSlide": function() {
            self.nextSlide();
        }
    });
}

$.extend( Presentation.prototype, {
     
    nextSlide: function() {
        var index = this.slideIndex();
        if ( index < this._slides.length - 1 ) {
            this.slideIndex( index + 1 );
        }
    },
    
    previousSlide: function() {
        var index = this.slideIndex();
        if ( index > 0 ) {
            this.slideIndex( index - 1);
        }
    },

    slideIndex: function( index ) {
        if ( index === undefined ) {
            // Getter
            var slide = Page.urlParameters().page;
            if ( !slide ) {
                return undefined;
            }
            var slideIndex = $.inArray( slide, this._slides );
            return ( slideIndex >= 0 )
                ? slideIndex
                : undefined;
        } else {
            // Setter
            if ( index >= 0 && index < this._slides.length ) {
                var slide = this._slides[ index ];
                window.location.href = "#page=" + slide;
            }
        }
    },
    
    start: function() {
        Page.trackClassFromUrl();
        this.slideIndex(0);
    }

});
