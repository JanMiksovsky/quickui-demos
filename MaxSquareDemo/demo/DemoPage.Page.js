var DemoPage = Page.sub({

    className: "DemoPage",

    inherited: {
        content: [
            { control: "MaxSquareGrid", ref: "photoGrid" }
        ],
        fill: true
    },

    initialize: function() {
        var count = Page.urlParameters().count || 12;
        var photos = [];
        for ( var i = 0; i < count; i++ ) {
            photos.push( Photo.create() );
        }
        this.$photoGrid().content( photos );
    }

});
