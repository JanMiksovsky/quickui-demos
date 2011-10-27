//
// BrowserSpecific
//
BrowserSpecific = Control.subclass( "BrowserSpecific" );
BrowserSpecific.prototype.extend({

    "default": Control.property(),
    "mozilla": Control.property(),
    "msie": Control.property(),
    "opera": Control.property(),
    "webkit": Control.property(),
    
    initialize: function() {
        var content;
        if ( $.browser.mozilla ) {
            content = this.mozilla();
        }
        else if ( $.browser.msie ) {
            content = this.msie();
        }
        if ( $.browser.opera ) {
            content = this.opera();
        }
        if ( $.browser.webkit ) {
            content = this.webkit();
        }
        if ( content === undefined ) {
            content = this[ "default" ]();
        }
        this.content( content );
    }
});

//
// ButtonBase
//
ButtonBase = Control.subclass( "ButtonBase" );
ButtonBase.prototype.extend({
    
    isFocused: Control.property.bool( null, false ),
    isKeyPressed: Control.property.bool( null, false ),
    isMouseButtonDown: Control.property.bool( null, false ),
    isMouseOverControl: Control.property.bool( null, false ),
    
    initialize: function() {
        var self = this;
        this
            .bind({
                blur: function( event ) { self.trackBlur( event ); },
                click: function( event ) {
                    if ( self.disabled() ) {
                        event.stopImmediatePropagation();
                    }
                },
                focus: function( event ) { self.trackFocus( event ); },
                keydown: function( event ) { self.trackKeydown( event ); },
                keyup: function( event ) { self.trackKeyup( event ); },
                mousedown: function( event ) { self.trackMousedown( event ); },
                mouseup: function( event ) { self.trackMouseup( event ); }
            })
            .genericIfClassIs( ButtonBase )
            .hover(
                function( event ) { self.trackMousein( event ); },
                function( event ) { self.trackMouseout( event ); }
            )
            ._renderButton();
    },
    
    trackBlur: function( event ) {
        
        this.removeClass( "focused" );

        // Losing focus causes the button to override any key that had been pressed.
        this.isKeyPressed( false );

        this.isFocused( false );
        this._renderButton();
    },
    
    // The current state of the button.
    buttonState: function() {
        if ( this.disabled() ) {
            return ButtonBase.state.disabled;
        } else if ( (this.isMouseButtonDown() && this.isMouseOverControl() )
            || this.isKeyPressed()) {
            return ButtonBase.state.pressed;
        } else if ( this.isFocused() ) {
            return ButtonBase.state.focused;
        } else if ( this.isMouseOverControl() /* || this.isMouseButtonDown() */ )
        {
            return ButtonBase.state.hovered;
        }

        return ButtonBase.state.normal;
    },

    /*
     * Get/set whether the control is disabled.
     * This is mapped to the disabled property on the control top-level element.
     * Setting this also applies "disabled" class in case the :disabled pseudo-class
     * is not supported.
     */
    disabled: function( disabled ) {
        if ( disabled === undefined ) {
            return this.prop( "disabled" );
        } else {
            var disabledBool = (String( disabled ) === "true" );
            this
                .prop( "disabled", disabledBool )
                .toggleClass( "disabled", disabledBool )
                ._renderButton();
            return this;
        }
    },
    
    trackFocus: function( event ) {
        if ( !this.disabled() )  {
            this.addClass( "focused" );
            this.isFocused( true );
            this._renderButton();
        }
    },
    
    trackKeydown: function( event ) {
        if ( !this.disabled() && (event.keyCode == 32 /* space */ || event.keyCode == 13 /* return */) ) {
            this.isKeyPressed( true );        
            this._renderButton();
        }
    },
    
    trackKeyup: function( event ) {
        this.isKeyPressed( false );
        this._renderButton();
    },
    
    trackMousedown: function( event ) {
        if ( !this.disabled() ) {
            this.addClass( "pressed" );
            this.isMouseButtonDown( true );
            this._renderButton();
        }
    },
    
    trackMousein: function( event ) {
        if (!this.disabled() )  {
            this.addClass( "hovered" );
            this.isMouseOverControl( true );
            this._renderButton();
        }
    },
    
    trackMouseout: function(event) {
        this
            .removeClass( "focused" )
            .removeClass( "hovered" )
            .removeClass( "pressed" );
        this.isMouseOverControl( false );
        this._renderButton();
    },
    
    trackMouseup: function( event ) {
        this.removeClass( "pressed" );
        this.isMouseButtonDown( false );
        this._renderButton();
    },
    
    _renderButtonState: function( buttonState ) {},
    
    _renderButton: function() {
        this._renderButtonState( this.buttonState() );
    }
});
$.extend( ButtonBase, {
    state: {
        normal: 0,
        hovered: 1,
        focused: 2,
        pressed: 3,
        disabled: 4
    }
});

//
// DeviceSpecific
//
DeviceSpecific = Control.subclass( "DeviceSpecific" );
DeviceSpecific.prototype.extend({

    "defaultClass": Control.property[ "class" ](),
    "mobileClass": Control.property[ "class" ](),
    "default": Control.property(),
    "mobile": Control.property(),
    
    initialize: function() {

        var deviceClass;
        var deviceClasses;
        var deviceContent;

        // Determine which content, class, and styles to apply.        
        if ( DeviceSpecific.isMobile() ) {
            deviceClass = this.mobileClass();
            deviceClasses = "mobile";
            deviceContent = this.mobile();
        }
        if ( deviceClass === undefined ) {
            deviceClass = this.defaultClass();
        }
        if ( deviceContent === undefined ) {
            deviceContent = this["default"]();
        }
        
        // Transmute, if requested. After this, we need to take care to 
        // reference the control with the new class; "this" will be the old class. 
        var $control = deviceClass
            ? this.transmute( deviceClass, false, true )
            : this;
        
        // Apply device-specific content, if defined.
        if ( deviceContent ) {
            $control.content( deviceContent );
        }
        
        // Apply device-specific CSS classes, if defined.
        if ( deviceClasses ) {
            $control.addClass( deviceClasses );
        }
    }
});

// Class methods
DeviceSpecific.extend({
    isMobile: function() {
        var userAgent = navigator.userAgent;
        return ( userAgent.indexOf("Mobile") >= 0 && userAgent.indexOf("iPad") < 0 ); 
    }    
});

//
// HasPopup
//
HasPopup = Control.subclass( "HasPopup", function renderHasPopup() {
	this.properties({
		"content": [
			" ",
			this._define( "$HasPopup_content", Control( "<div id=\"HasPopup_content\" />" ) ),
			" ",
			this._define( "$HasPopup_popup", Popup.create({
				"id": "HasPopup_popup"
			}) ),
			" "
		]
	}, Control );
});
HasPopup.prototype.extend({
    
    cancel: Control.chain( "$HasPopup_popup", "cancel" ),
    content: Control.chain( "$HasPopup_content", "content" ),
    close: Control.chain( "$HasPopup_popup", "close" ),
    closeOnInsideClick: Control.chain( "$HasPopup_popup", "closeOnInsideClick" ),
    openOnClick: Control.property.bool(),
    open: Control.chain( "$HasPopup_popup", "open" ),
    opened: Control.chain( "$HasPopup_popup", "opened" ),
    popup: Control.chain( "$HasPopup_popup", "content" ),

    initialize: function()
    {
        var self = this;
        this.bind( "opened", function() {
            self._positionPopup();
        });
        
        this._bindContentEvents();
    },
    
    /*
     * We bind handlers to the content here. Subclasses like ComboBox may
     * transmute the content to different classes, so they'll need some
     * function they can call (and override) to rebind any handlers.
     */
    _bindContentEvents: function() {
        var self = this;
        this.$HasPopup_content().click( function() {
            if ( self.openOnClick() ) {
                self.open();
            }
        });
    },
    
    _positionPopup: function() {
        
        var position = this.position();
        var top = Math.round( position.top );
        var left = Math.round( position.left );
        var height = this.outerHeight();
        var width = this.outerWidth();
        var bottom = top + height;
        var right = left + width;
        
        var $popup = this.$HasPopup_popup();
        var popupHeight = $popup.outerHeight( true );
        var popupWidth = $popup.outerWidth( true );

        var scrollTop = $( document ).scrollTop();
        var scrollLeft = $( document ).scrollLeft();
        var windowHeight = $( window ).height();
        var windowWidth = $( window ).width();

        // Vertically position below (preferred) or above the content.
        var popupFitsBelow = ( bottom + popupHeight <= windowHeight + scrollTop );
        var popupFitsAbove = ( top - popupHeight >= scrollTop ); 
        var popupTop = ( popupFitsBelow || !popupFitsAbove )
                            ? bottom                 // Show below
                            : top - popupHeight;     // Show above
        
        // Horizontally left (preferred) or right align w.r.t. content.
        var popupFitsLeftAligned = ( left + popupWidth <= windowWidth + scrollLeft );
        var popupFitsRightAligned = ( right - popupWidth >= scrollLeft );
        var popupLeft = ( popupFitsLeftAligned || !popupFitsRightAligned )
                            ? left                   // Left align
                            : right - popupWidth;    // Right align 

        $popup.css({
            "top": popupTop,
            "left": popupLeft
        });
    }
});

//
// Layout
//
Layout = Control.subclass( "Layout" );
Layout.prototype.extend({
    
    initialize: function() {
        Layout.track( this );
    },
    
    // Base implementation does nothing.
    layout: function() {
        return this;
    }
    
    /* For debugging
    _log: function(s) {
        console.log(this.className + "#" + this.attr("id") + " " + s);
        return this;
    }
    */
    
});

// Class methods.
// TODO: Most of this has been factored into the new inDocument() event,
// so rewrite this to use that.
Layout.extend({
    
    /*
     * Re-layout any controls in the DOM.
     */
    recalc: function() {

        //console.log("recalc");
        if ( !this._controlsToLayout ) {
            return;
        }

        // Call the layout() method of any control whose size has changed.
        var i = 0;
        while ( i < this._controlsToLayout.length ) {
            var $control = Control( this._controlsToLayout[i] ).control();
            if ( $control ) {
                var previousSize = $control.data( "_size" );
                var size = {
                    height: $control.height(),
                    width: $control.width()
                };
                if ( previousSize === undefined ||
                    size.height != previousSize.height ||
                    size.width != previousSize.width ) {
                        
                    $control
                        .data( "_size", size )
                        .layout();
                }
                i++;
            }
            else
            {
                // Control unavailable, likely no longer in DOM;
                // remove it from our list of controls to track.
                this._controlsToLayout.splice( i, 1 );
            }
        }
    },
    
    /*
     * Start tracking the indicated controls for layout purposes.
     * We won't actually lay them out until they're added to the DOM.
     */
    track: function( $controls ) {
        //$controls._log("tracking");
        this._initialize();
        $controls.inDocument( function( $control ) {
            $control.layout();
            Layout._controlsToLayout = Layout._controlsToLayout.concat( $control );
        });
    },

    /* TODO: Allow a control to be stop being tracked for layout purposes.
    untrack: function($controls) {
        ...
        this.recalc();
    },
    */
    
    /*
     * Initialize layout engine overall (not a specific instance).
     */
    _initialize: function() {
        
        if ( this._initialized ) {
            // Already did this.
            return;
        }
        
        // The following control array is maintained in order such that
        // DOM parents come before their children. 
        this._controlsToLayout = [];
        
        // Recalc layout whenever the window size changes.
        $( window ).resize( function() {
            Layout.recalc();
        });
        
        this._initialized = true;
    }
        
});

//
// List
//
List = Control.subclass( "List" );
List.prototype.extend({
    
    // The control class that should be used to render items in the list.
    itemClass: Control.property[ "class" ]( function() { this._refresh(); }, Control ),
    
    // True if the control should mark itself dirty when it gets a change event.
    dirtyOnChange: Control.property.bool( null, false ),
    
    // True if the control contents have been changed since the controls were first created.
    isDirty: Control.property.bool( null, true ),
    
    // A copy of the items the last time they were created or refreshed.
    _itemsCache: Control.property(),
    
    initialize: function() {
        var self = this;
        this.change( function( event ) {
            if ( self.dirtyOnChange() ) {
                // Assume the list is dirty.
                self.isDirty( true );
            }
        });
    },
    
    /*
     * The collection of controls in the list generated by setting the items() property.
     * This is always returned as an instance of itemClass.
     */
    controls: function() {
        var itemClass = this.itemClass();
        return itemClass( this ).children();
    },
    
    // The items in the list.
    items: function( items ) {
        if ( items === undefined ) {
            if ( this.isDirty() ) {
                this
                    ._itemsCache( this._getItemsFromControls() )
                    .isDirty( false );
            }
            return this._itemsCache();
        } else {
            return this
                ._itemsCache( items )
                ._createControlsForItems( items )
                .isDirty( false );
        }
    },
    
    //
    // Used to map an incoming list item to property setters on the control
    // class indicated by itemClass. This can either be a simple string,
    // in which case it will be taken as the name of a control class property,
    // Alternately, this can be a function of the form:
    //
    //      function foo( item ) { ... }
    //
    // where item is the list item.
    //
    // If item is undefined, the map function is being invoked as a getter,
    // and should extract the item from the control (available via "this").
    // If item is defined, the map function is being invoked as a setter, and
    // should pass the item to the control (e.g., by setting properties on it).
    //
    mapFunction: Control.property(
        function() { this._refresh(); },
        "content"
    ),
    
    _createControlsForItems: function( items ) {
        var itemClass = this.itemClass();
        var mapFunction = this._getMapFunction();
        var controls = $.map( items || [], function( item, index ) {
            var $control = itemClass.create();
            mapFunction.call( $control, item );
            return $control;
        });
        this.content( controls );
        return this;
    },
    
    _getItemsFromControls: function() {
        var mapFunction = this._getMapFunction();
        return this.controls().map( function( index, element ) {
            var $control = $( element ).control();
            return mapFunction.call( $control );
        }).get();
    },
    
    /*
     * If the list's mapFunction property is a simple string, create a
     * function that invokes the item control's property getter/setter with
     * that string name. Otherwise, return the mapFunction value as is.  
     */
    _getMapFunction: function() {
        var mapFunction = this.mapFunction();
        return typeof mapFunction === "string"
            ? function( item ) { return this[ mapFunction ]( item ); }
            : mapFunction;
    },

    // Get all the items, then recreate them again (possibly as different controls).        
    _refresh: function() {
        this.items( this.items() );
    }

});

//
// Page
//
Page = Control.subclass( "Page" );
/*
 * General page utility functions.
 */
Page.prototype.extend({
    
    // If true, have the page fill its container.
    fill: Control.chain( "applyClass/fill" ),

    urlParameters: function() {
        return Page.urlParameters();
    },
        
    // Gets or sets the title of the page.
    title: function( title ) {
        if ( title === undefined ) {
            return document.title;
        } else {
            document.title = title;
            return this;
        }
    }

});

/*
 * Class members.
 */
Page.extend({

    /*
     * Start actively tracking changes in a page specified on the URL.
     * For a URL like www.example.com/index.html#page=Foo, load class Foo.
     * If the page then navigates to www.example.com/index.html#page=Bar, this
     * will load class Bar in situ, without forcing the browser to reload the page. 
     */
    trackClassFromUrl: function( defaultPageClass, target ) {
        
        var $control = Control( target || "body" );
        
        // Watch for changes in the URL after the hash.
        $( window ).hashchange( function() {
            var pageClass = Page.urlParameters().page || defaultPageClass;
            $control.transmute( pageClass );
        })
            
        // Trigger a page class load now.
        $( window ).hashchange();
    },
    
    /*
     * Return the URL parameters (after "&" and/or "#") as a JavaScript object.
     * E.g., if the URL looks like http://www.example.com/index.html?foo=hello&bar=world
     * then this returns the object
     *
     *    { foo: "hello", bar: "world" }
     *
     */
    urlParameters: function() {
        var regex = /[?#&](\w+)=([^?#&]*)/g;
        var results = {};
        var match = regex.exec( window.location.href );
        while (match != null) {
            var parameterName = match[1];
            var parameterValue = match[2];
            results[ parameterName ] = parameterValue;
            match = regex.exec( window.location.href );
        }
        return results;
    }    
    
});

/*
 * General utility functions made available to all controls.
 */
Control.prototype.extend({
    
    /*
     * Look up the page hosting a control.
     */
    page: function() {
        // Get the containing DOM element subclassing Page that contains the element
        var pages = this.closest( ".Page" );
        
        // From the DOM element, get the associated QuickUI control.
        return ( pages.length > 0 ) ? pages.control() : null;
    }
    
});

//
// Popup
//
Popup = Control.subclass( "Popup" );
Popup.prototype.extend({

    blanket: Control.property(),
    blanketColor: Control.property(),
    blanketOpacity: Control.property(),
    cancelOnEscapeKey: Control.property.bool( null, true ),
    cancelOnOutsideClick: Control.property.bool( null, true ),
    closeOnInsideClick: Control.property.bool(),
    
    initialize: function()
    {
        var self = this;
        this
            .click( function() {
                if ( self.closeOnInsideClick() )
                {
                    self.close();
                }
            })
            .genericIfClassIs( Popup );
    },
    
    /*
     * Cancel the popup. This is just like closing it, but raises a "canceled"
     * event instead.
     * 
     * This has no effect if the popup is already closed.
     */
    cancel: function() {
        return !this.opened()
            ? this
            : this
                .trigger( "canceled" )
                ._hidePopup();
    },
    
    /*
     * Close the popup (dismiss it).
     * 
     * This has no effect if the popup is already closed.
     */
    close: function() {
        return !this.opened()
            ? this
            : this
                .trigger("closed")
                ._hidePopup();
    },

    /*
     * Open the popup (show it).
     * 
     * This has no effect if the popup is already opened.
     */
    open: function()
    {
        if ( this.opened() ) {
            return this;
        }
        
        if ( this.blanket() == null ) {
            this.blanket( this._createBlanket() );
        }
        
        /* Show control and blanket at the top of the Z-order. */
        var maximumZIndex = this._maximumZIndex();
        this.blanket()
            .css( "z-index", maximumZIndex + 1 )
            .show();
            
        this
            ._bindKeydownHandler( true )
            .css( "z-index", maximumZIndex + 2 )
            .show()
            .positionPopup()
            .trigger( "opened" );
            
        // In case the overlay wants to resize anything now that it's visible.
        Layout.recalc();
        
        return this;
    },
    
    // Return true if the popup is currently open (visible).
    opened: function() {
        return this.blanket() != null;
    },
    
    // Subclasses should override this to position themselves.
    positionPopup: function() {
        return this;
    },
    
    _bindKeydownHandler: function( handleKeydown ) {
        var handler;
        if ( handleKeydown ) {
            var self = this;
            handler = function( event) {
                if ( self.cancelOnEscapeKey() && event.keyCode === 27 /* Escape */ ) {
                    self.cancel();
                }
            }
            this.data( "_keydownHandler", handler );
            $( document ).bind( "keydown", handler );
        } else {
            handler = this.data( "_keydownHandler" );
            if ( handler ) {
                $( document ).unbind( "keydown", handler );
            }
        }
        return this;
    },

    _createBlanket: function() {
        
        var $blanket = this
            .after( "<div id='blanket'/>" )
            .next();
            
        var cancelOnOutsideClick = this.cancelOnOutsideClick();
        var color = this.blanketColor() ||
                        ( cancelOnOutsideClick ? false : "black" );
        var opacity = this.blanketOpacity() ||
                        ( cancelOnOutsideClick ? 0.01 : 0.25 );
            
        var self = this;
        $blanket
            .click( function() {
                if ( self.cancelOnOutsideClick() ) {
                    self.cancel();
                }
            })
            .css({
                cursor: "default",
                position: "fixed",
                opacity: opacity,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            });
        if ( color ) {
            $blanket.css( "background-color", color );
        }
        
        return $blanket;
    },

    _hidePopup: function()
    {
        this
            ._bindKeydownHandler( false )
            .hide()
            .css( "z-index", null ); // No need to define Z-order any longer.
        if ( this.blanket() != null ) {
            this.blanket().remove();
            this.blanket(null);
        }
        
        return this;
    },

    /* Return the maximum Z-index in use by the page and its top-level controls. */
    _maximumZIndex: function()
    {
        var topLevelElements = $( "body" ).children().andSelf();
        var zIndices = $.map( topLevelElements, function( element ) {
            switch ( $(element).css("position") ) {
                case "absolute":
                case "fixed":
                    var zIndex = parseInt( $( element ).css( "z-index" ) ) || 1;
                    return zIndex;
            }
        });
        return Math.max.apply( null, zIndices );
    }
});

//
// Sprite
//
Sprite = Control.subclass( "Sprite" );
Sprite.prototype.extend({
    
    image: Control.chain( "css/background-image" ),

    // The height of a single cell in the strip, in pixels.
    cellHeight: Control.property( function( value ) {
        this.css( "height", value + "px" );
        this._shiftBackground();
    }),
    
    // The cell currently being shown.
    currentCell: Control.property( function( value ) {
        this._shiftBackground();
    }, 0),

    _shiftBackground: Control.iterator( function() {
        if ( this.currentCell() != null && this.cellHeight() != null ) {
            var y = ( this.currentCell() * -this.cellHeight() ) + "px";
            if ( $.browser.mozilla ) {
                // Firefox 3.5.x doesn't support background-position-y,
                // use background-position instead.
                var backgroundPosition = this.css( "background-position" ).split(" ");
                backgroundPosition[1] = y;
                this.css( "background-position", backgroundPosition.join(" ") );          
            } else {
                // Not Firefox
                this.css( "background-position-y", y );
            }
        }
    })
});

//
// Switch
//
Switch = Control.subclass( "Switch" );
Switch.prototype.extend({
    
    initialize: function() {
        if ( this.children().not( ".hidden" ).length > 1 ) {
            // Show first child by default. 
            this.activeIndex(0);
        }
    },
    
    /*
     * The currently visible child, cast to a control (if applicable).
     */
    activeChild: Control.iterator( function( activeChild ) {
        if ( activeChild === undefined ) {
            return this.children().not( ".hidden" ).eq(0).cast( jQuery );
        } else {
            
            /*
             * Apply a "hidden" style instead of just forcing display to none.
             * If we did that, we would have no good way to undo the hiding.
             * A simple .toggle(true) would set display: block, which wouldn't
             * be what we'd want for inline elements.
             */
            this.children().not( activeChild ).toggleClass( "hidden", true );

            var activeChildIndex = this.children().index( activeChild );

            // Tell the child it's now active, and show it.
            $( activeChild )
                .trigger( "active" )
                .toggleClass( "hidden", false );
                
            // Trigger our own activeChildChanged event.
            this.trigger( "activeChildChanged", [ activeChildIndex, activeChild ] );
            
            // In case the new child wants to re-lay itself out.
            Layout.recalc();
            
            return this;
        }
    }),
    
    // The index of the currently visible child.
    activeIndex: function( index ) {
        if ( index === undefined ) {
            return this.children().index( this.activeChild() );
        } else {
            return this.activeChild( this.children().eq( index ) );
        }
    }
        
});

//
// Tab
//
Tab = Control.subclass( "Tab" );
Tab.prototype.extend({
    name: Control.property()
});

//
// TabSet
//
TabSet = Control.subclass( "TabSet", function renderTabSet() {
	this.properties({
		"content": [
			" ",
			VerticalPanels.create({
				"content": [
					" ",
					" ",
					this._define( "$TabSet_content", Switch.create({
						"id": "TabSet_content"
					}) ),
					" "
				],
				"fill": "true",
				"top": [
					" ",
					this._define( "$tabButtons", List.create({
						"id": "tabButtons",
						"itemClass": "ButtonBase"
					}) ),
					" "
				]
			}),
			" "
		]
	}, Control );
});
TabSet.prototype.extend({

    content: Control.chain( "$TabSet_content", "content", function() { this._refresh(); } ),
    selectTabOnClick: Control.property.bool( null, true ),
    tabButtons: Control.chain( "$tabButtons", "children" ),
    selectedTab: Control.chain( "$TabSet_content", "activeChild" ),
    tabButtonClass: Control.chain( "$tabButtons", "itemClass", function() { this._refresh(); } ),
    tabs: Control.chain( "$TabSet_content", "children", "cast" ),
    
    initialize: function() {
        
        this.genericIfClassIs( TabSet );
        
        var self = this;
        this.$tabButtons().click( function( event ) {
            var tabButtonCssClass = "." + self.tabButtonClass().prototype.className;
            var tabButton = $( event.target ).closest( tabButtonCssClass ).control();
            if ( tabButton ) {
                var index = self.tabButtons().index( tabButton );
                if ( index >= 0 ) {
                    var tab = self.tabs()[ index ];
                    self.trigger( "tabClick", [ index, tab ]);
                    if ( self.selectTabOnClick() ) {
                        self.selectedTabIndex( index );
                    }
                }
            }
        });
        
        /*
         * Map the Switch's activeChildChanged event to a more semantically
         * specific activeTabChanged event.
         */
        this.$TabSet_content().bind({
            "activeChildChanged": function( event, index, child ) {
                // Only map active events coming from our own Switch;
                // ignore events coming from any Switch within a tab.
                var tab = $( event.target ).filter( self.tabs() );
                if ( tab.length > 0 ) {
                    event.stopPropagation();
                    self.trigger( "activeTabChanged", [ index, child ] );
                }
            }
        });
        
        if ( this.tabs().length > 0 && !this.selectedTabIndex() ) {
            // Select first tab by default.
            this.selectedTabIndex(0);
        }
    },
    
    selectedTabIndex: Control.chain( "$TabSet_content", "activeIndex", function( index ) {
        this.tabButtons()
            .removeClass( "selected" )    // Deselect all tab buttons.
            .eq( index )
            .addClass( "selected" );      // Select the indicated button.
    }),

    _refresh: function() {
        if ( this.tabButtonClass() === undefined ) {
            return;
        }
        
        // Show the names for each tab as a button.
        var tabNames = this.tabs()
            .map( function( index, tab ) {
                var $tab = $( tab ).control();
                return ( $tab && $.isFunction( $tab.name ) )
                    ? $tab.name()
                    : "";
            })
            .get();
        this.$tabButtons().items( tabNames );
    }
});

//
// TextBox
//
TextBox = Control.subclass( "TextBox", function renderTextBox() {
	this.properties({
		"content": [
			" ",
			this._define( "$textBox", Control( "<input id=\"textBox\" type=\"text\" />" ) ),
			" "
		]
	}, Control );
});
TextBox.prototype.extend({
    content: Control.chain( "$textBox", "content" )
});

//
// ToggleButton
//
ToggleButton = ButtonBase.subclass( "ToggleButton", function renderToggleButton() {
	this.properties({

	}, ButtonBase );
});
ToggleButton.prototype.extend({
    
    selected: Control.chain( "applyClass/selected" ),
    
    initialize: function() {
        this._super();
        var self = this;
        this
            .click( function() {
                if ( !self.disabled() ) {
                    self.toggleSelected();
                }
            })
            .genericIfClassIs( ToggleButton );
    },
    
    toggleSelected: function( value ) {
        this.selected( value || !this.selected() );
    }
});

//
// VerticalAlign
//
VerticalAlign = Control.subclass( "VerticalAlign" );

//
// VerticalPanels
//
VerticalPanels = Layout.subclass( "VerticalPanels", function renderVerticalPanels() {
	this.properties({
		"content": [
			" ",
			this._define( "$VerticalPanels_top", Control( "<div id=\"VerticalPanels_top\" />" ) ),
			" ",
			this._define( "$VerticalPanels_content", Control( "<div id=\"VerticalPanels_content\" />" ) ),
			" ",
			this._define( "$VerticalPanels_bottom", Control( "<div id=\"VerticalPanels_bottom\" />" ) ),
			" "
		]
	}, Layout );
});
VerticalPanels.prototype.extend({
    
    bottom: Control.chain( "$VerticalPanels_bottom", "content" ),
    content: Control.chain( "$VerticalPanels_content", "content" ),
    fill: Control.chain( "applyClass/fill" ),
    top: Control.chain( "$VerticalPanels_top", "content" ),
    
    layout: function() {
        //this._log("layout");
        var panelHeight = this.$VerticalPanels_top().outerHeight() + this.$VerticalPanels_bottom().outerHeight();
        var availableHeight = this.height() - panelHeight;
        this.$VerticalPanels_content().height( availableHeight );
        return this;
    }
});

//
// ComboBox
//
ComboBox = HasPopup.subclass( "ComboBox", function renderComboBox() {
	this.properties({
		"content": [
			" ",
			this._define( "$ComboBox_content", Control( "<div id=\"ComboBox_content\" />" ) ),
			" ",
			this._define( "$dropdownButton", ToggleButton.create({
				"content": "▼",
				"id": "dropdownButton"
			}) ),
			" "
		]
	}, HasPopup );
});
ComboBox.prototype.extend({

    closeOnEnter: Control.property.bool( null, true ),
    content: Control.chain( "$ComboBox_content", "content" ),
    openOnFocus: Control.property.bool( null, true ),
    
    initialize: function() {
        
        this._super();
        this.genericIfClassIs( ComboBox );
        
        var self = this;
        this.$HasPopup_popup().bind({
            "closed canceled": function() {
                self.$dropdownButton().selected( false );
            }
        });
        this.$dropdownButton().click( function() {
            self.open();
        });
        
        if ( !this.textBoxClass() ) {
            // Set a default text box class
            this.textBoxClass( TextBox );
        }
    },
    
    /*
     * Return the combo box's input control. By default we return the first
     * text input element in the content. Subclasses can override this to
     * point at a different element.
     */
    inputControl: function() {
        return this.$ComboBox_content().find( "input[type='text']" ).eq(0);
    },
    
    open: function() {
        if ( !this.opened() ) {
        
            if ( this.hasClass( "generic" ) ) {
                // Make popup at least as wide as content.
                this.eachControl( function( index, $control ) {
                    var width = $control.outerWidth();
                    this.$HasPopup_popup().css( "min-width", width + "px" );
                });
            }
            
            // User may have invoked popup by clicking in text box with
            // openOnFocus true, in which case we should ensure button looks
            // pressed while popup is open.
            this.$dropdownButton().selected( true );
            
        }
        return this._super();
    },

    /*
     * The class of the text box portion of the combo box.
     */
    textBoxClass: Control.property[ "class" ]( function( textBoxClass ) {
        
        this.$ComboBox_content().transmute( textBoxClass );
        
        // Rebind any content events we want to track.
        this._bindContentEvents();
    }),
    
    _bindContentEvents: function() {
        
        this._super();
        
        var self = this;
        this.$ComboBox_content().bind({
            "keydown": function( event ) {
                if ( event.which === 13 /* Enter key */
                    && self.closeOnEnter()
                    && self.$HasPopup_popup().opened() ) {
                    self.close();
                }
            }
        });
        this.$ComboBox_content().find( "input" ).bind({
            "blur": function( event ) {
                /*
                 * We want to close the popup if the focus moves completely
                 * outside the combo box; i.e., is not within the input box or
                 * the popup. Unfortunately, if the user clicks in the popup,
                 * the input will blur before we've had a chance to even
                 * register the click. And at the point the blur handler here
                 * is invoked, document.activeElement may not be set yet,
                 * so we can't inspect it to see whether the focus is still
                 * inside the popup.
                 * 
                 * HACK: We close the popup in a timeout, trusting that any
                 * click within the popup will have completed by the time the
                 * timeout completes. Wish there were a better way to do this;
                 * relying on the timing of events this way is far too fragile.
                 * In defense, this blur behavior is meant as a clean-up step
                 * in the case where the user fails to make a choice or
                 * actively dismiss the popup; presumably, this situation won't
                 * come up all that often.
                 */
                if ( self.opened() ) {
                    setTimeout( function() {
                        self.cancel(); 
                    }, 250 );
                }
            },
            "click focus": function() {
                if ( self.openOnFocus() ) {
                    self.open();
                }
            }
        });
    }

});

//
// Dialog
//
Dialog = Popup.subclass( "Dialog", function renderDialog() {
	this.properties({
		"cancelOnOutsideClick": "false"
	}, Popup );
});
Dialog.prototype.extend({
    
    initialize: function() {
        this._super();
        this.genericIfClassIs( Dialog );
    },
    
    cancel: function() {
        this._super();
        this.remove();
    },
    
    close: function() {
        this._super();
        this.remove();
    },
    
    positionPopup: function() {
        // Center dialog horizontally and vertically.
        return this.css({
            left: ($(window).width() - this.outerWidth()) / 2,
            top: ($(window).height() - this.outerHeight()) / 2
        });
    }

});

// Class methods
Dialog.extend({
    showDialog: function( dialogClass, properties, callbackOk, callbackCancel ) {
        $("body")
            .append( "<div/>" )
            .find( ":last" )
            .bind({
                closed: function() {
                    if ( callbackOk ) {
                        callbackOk.call( $( this ).control() );
                    }
                },
                canceled: function() {
                    if ( callbackCancel ) {
                        callbackCancel.call( $( this ).control() );
                    }
                }
            })
            .control( dialogClass, properties )
            .open();
    }
});

//
// HorizontalPanels
//
HorizontalPanels = Layout.subclass( "HorizontalPanels", function renderHorizontalPanels() {
	this.properties({
		"content": [
			" ",
			this._define( "$HorizontalPanels_left", Control( "<div id=\"HorizontalPanels_left\" />" ) ),
			" ",
			this._define( "$HorizontalPanels_content", Control( "<div id=\"HorizontalPanels_content\" />" ) ),
			" ",
			this._define( "$HorizontalPanels_right", Control( "<div id=\"HorizontalPanels_right\" />" ) ),
			" "
		]
	}, Layout );
});
HorizontalPanels.prototype.extend({
    
    content: Control.chain( "$HorizontalPanels_content", "content" ),
    fill: Control.chain( "applyClass/fill" ),
    left: Control.chain( "$HorizontalPanels_left", "content" ),
    right: Control.chain( "$HorizontalPanels_right", "content" ),
    
    layout: function() {
        var panelLeftWidth = this.$HorizontalPanels_left().outerWidth();
        var panelRightWidth = this.$HorizontalPanels_right().outerWidth();
        this.$HorizontalPanels_content().css({
            left: panelLeftWidth,
            right: panelRightWidth
        });
        return this;
    }
});

