/*
 * Populate the given list with tiles for the indicated friends.
 */
function createFriendList( $list, friends ) {

    var tiles = $.map( friends, function( friend, index ) {
        return createFriendTile( friend );
    });

    $list
        .empty()
        .append("<h1>Friends</h1>")
        .append.apply( $list, tiles );
}

/*
 * Return a div showing details for the given friend.
 */
function createFriendTile( friend ) {
    
    var $picture = $( "<img>" )
        .addClass( "picture" )
        .prop( "src", friend.picture );
        
    var $name = $( "<div>" )
        .addClass( "name" )
        .text( friend.name );
        
    return $( "<div>" )
        .addClass( "tile" )
        .append( $picture )
        .append( $name );
}

// The array of friends
var friends = [
    {
        name: "Ann",
        picture: "../resources/picture1.png"
    },
    {
        name: "Bob",
        picture: "../resources/picture2.png"
    },
    {
        name: "Carol",
        picture: "../resources/picture3.png"
    }
];
