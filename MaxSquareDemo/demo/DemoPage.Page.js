var DemoPage = Page.sub({

    className: "DemoPage",

    inherited: {
        content: [
            { control: "PhotoCanvas", ref: "photoCanvas" }
        ],
        fill: true
    },
    
    getFlickrPhotos: function( apiKey, method, callback ) {
        var baseUrl = "http://api.flickr.com/services/rest/";
        var count = Page.urlParameters().count || 12;
        var url = baseUrl + 
                    "?api_key=" + apiKey +
                    "&method=" + method +
                    "&per_page=" + count +
                    "&format=json" +
                    "&nojsoncallback=1";
        $.getJSON( url, function ( data ) {
            callback( data.photos.photo );
        });
    },
    
    getFlickrImageSrc: function( flickrPhoto ) {
        return "http://farm" + flickrPhoto.farm +
               ".static.flickr.com/" + flickrPhoto.server +
               "/" + flickrPhoto.id +
               "_" + flickrPhoto.secret +
               ".jpg";
    },
    
    getFlickrImageHref: function( flickrPhoto ) {
        return "http://flickr.com/photo.gne?id=" + flickrPhoto.id;
    },

    initialize: function() {
        var apiKey = "c3685bc8d8cefcc1d25949e4c528cbb0";
        var method = "flickr.interestingness.getList";
        var self = this;
        this.getFlickrPhotos( apiKey, method, function( flickrPhotos ) {
            var photos = $.map( flickrPhotos, function( flickrPhoto ) {
                return {
                    src: self.getFlickrImageSrc( flickrPhoto ),
                    href: self.getFlickrImageHref( flickrPhoto )
                };
            })
            self.$photoCanvas().photos( photos );
        });
    }

});
