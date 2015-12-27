/*var state = new State( [ { x: 10, y: 50, width: 120, fontSize: "1em" }, { x: 10, y: 700, width: 120, fontSize: "1em" } ]);
MenuStates.addState("home", state);*/


$(function() {
	vc = new VController();

	// get on click events

	$(".menu-item").on( "click", function() { events.emit("itemClicked", $(this).index() ); });
	$(".home-button").on("click", function() { events.emit("homeClicked")});
	window.onresize = function() { events.emit("resize"); };

	events.on( "itemClicked", function( data ) { vc.clickHandler.bind( vc )( data ); } );
	events.on( "homeClicked", function() { vc.clickHandler.bind( vc )( "home" ); });
});
