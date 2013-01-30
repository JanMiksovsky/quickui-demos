var Photo = Control.sub({

    className: "Photo",

    inherited: {
        content: {
            html: "<img>", ref: "photo"
        }
    },

    href: Control.property(),

    initialize: function() {
        var self = this;
        this.$photo().click( function() {
            window.location.href = self.href();
        });
    },

    src: Control.chain( "$photo", "attr/src" )
    
});
