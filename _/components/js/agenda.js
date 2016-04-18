var Agenda = {
	container: {
		/*html: "",*/
		css: {
			"position": "absolute",
			"left": 	"0",
			"top": 	 	"80px",
			"width": 	"1000%",
			"height": 	"220px",
			"overflow": "hidden"
		}, // css
		timeLine: []



	}, // container

	markUp: 	"",   // hier das einzuhängende HTML

	numberOfEventboxes: 0 ,

	deceleration: 	0.9,

	isMouseDown: 	false,
	isTouch:        false,
	draggedObject: 	{
		domElement: 	{},
		x: 	0,
		y: 	0

	},


	leftPos: 	0,
	oldLeftPos: 	0,
	scrollSpeed: 	0,
	lastT: 			0,
	deltaT: 		0,
	scrolling: 		false,
	scrollHandler: 	function() {},




	// functions ----------------------------------------------------------------------------------------

	


	init: 	function() {
		var self = Agenda;		

		// loadData and make HTML
		var agenda = document.createElement('div');
		agenda.className = "agenda invisible";

	

		$.ajax({
		  dataType: "json",
		  url: "include/events.json",
		  
		  success:  function( data ) { 

		  	Agenda.numberOfEventboxes = 0;

		  	var html = "<div class='agenda'>";

			$.each( data, function( key, elem ) {
				// events.push( elem );

				var besetzung = "";
				Agenda.numberOfEventboxes++;

				$.each( elem.besetzung, function( rolle, darsteller ) { 
					if ( rolle.substring(0, 1) != "-" ) {			
						besetzung += "<div class='zeile'><span class='rolle'>"+ rolle +":</span><span class='darsteller'>"+ darsteller +"</span></div>";
					}
					else {		// if rolle == "-", there is only one line which has to be centered, stored in "darsteller"
						besetzung+="<div class='zeile'><div class = 'one-line'>" + darsteller + "</div></div>";
					}
				});

				html += '<div class="event">
							<div class="event-up">
								<div class="komponist">' + elem.komponist + '</div>
								<div class="title">'+ elem.title +'</div>
								<div class="ort">'+ elem.ort +'</div>
							</div> 
							<div class="event-date">
								<div class="datum">'+ elem.datum +'</div>
							</div>'; //event-date 
							//  <div class="card">
							// <div class="event-low">
							// 	<div class="besetzung">'+ besetzung +'</div>
							// </div>';  */

						if ( elem.image !== undefined ) {
							html += '<div class="card flippable"><div class="event-low flipped"><div class="besetzung">'+ besetzung +'</div></div>';

							html += ' <div class="event-image"> <img src ="'+ elem.image +'"/> </div></div>';
						} else {
							html += '<div class="card"><div class="event-low"><div class="besetzung">'+ besetzung +'</div></div></div>';
						}

						html += '</div>';
				});		// each

			html += "</div>";

			html += "<div class='scroll-div-wrapper'><div class='scroll-div'><div class='kloetzchen'></div><div class='strich'></div></div></div>";
			self.html = html;



			} // success
		}); // ajax

	},	// init

	getMarkUp: 	function() {
		return Agenda.html;
	},

	
	// Seite aktivieren
	activate: 	function () {
		var self = Agenda;

		self.navMenuItem = $(".kloetzchen")[0];
		self.activateNavigation();

		$(".scroll-div-wrapper").toggleClass("hide");  // hide scroll Bar (in case it must be moved in 'callback')


	},

	deactivate: function() {
		Agenda.deactivateNavigation();  
	},

	

	// callback after html is inserted
	callback: function() {
		var self = this;

		if (window.innerHeight < 750) {   // if screen is to narrow move scroll div to bottom
			$(".scroll-div-wrapper").css("bottom","0");
		}
		if (window.innerHeight < 700) {
			$(".event").css({ "font-size": "80%", "height": ""})
		}
		$(".scroll-div-wrapper").toggleClass("hide");  // then show it


		self.eventBoxWidth = $(".event")[0].getBoundingClientRect()["width"] + 1;
		self.timelineLength = Agenda.numberOfEventboxes * ( self.eventBoxWidth + 28 );  // + margin!!!
		$(".agenda").css("width", self.timelineLength + "px");

		$("body").mousewheel( self.mouseScrollHandler );

		$(".flippable").click( function() {
			$("div", this).toggleClass("flipped");
		} );

		self.scrollWidth = parseInt( $(".scroll-div").css("width"), 10);  // Breite des Scroll-Divs
		self._maxScrollWidth = window.getComputedStyle( $(".agenda")[0], null ).width;
		self._maxScrollWidth = parseInt( self._maxScrollWidth, 10) - 0.7 * window.innerWidth;

		// set right Event in place

			var leftPosAtStart = $(".event").eq(8).position().left;
			console.log( leftPosAtStart );
			
			var kloetzchenPos = (leftPosAtStart - 0.28 * window.innerWidth ) * (self.scrollWidth - 32) / self._maxScrollWidth;
			$(self.navMenuItem).animate( {"left": kloetzchenPos + "px"}, 700);
			
			self.scrollAgendaAccordingScrollIcon( kloetzchenPos );


	},


	// navigation -------------------------------------------------------------------------------------------------

	activateNavigation: 	function() {
		var self = Agenda;

		$(".scroll-div")[0].addEventListener("mousedown", Agenda.mouseDownHandler, false );
		document.body.addEventListener("mouseup", Agenda.mouseUpHandler, false );
		document.body.addEventListener("mousemove", Agenda.mouseMoveHandler, false );

		$(document).on("touchstart",".agenda", Agenda.touchStartHandler );
		$(document).on("touchend", "body", Agenda.touchEndHandler );
		$(document).on("touchmove", "body", Agenda.touchMoveHandler );
	
	},

	deactivateNavigation: 	function() {
		var self = Agenda;
		$(".agenda")[0],removeEventListener("mousedown", self.mouseDownHandler );
		document.body.removeEventListener("mouseup", self.mouseUpHandler );
		document.body.removeEventListener("mouesemove", self.mosueMoveHandler );
		$("body").off();
		},


	animateTimeline: 	function() {
		var self = Agenda;

		$(".agenda").css("left", self.leftPos + "px" );
	},
	

	
	mouseDownHandler: function( event ) {
		var self = Agenda;

		var scrollDivRect = $(".scroll-div")[0].getBoundingClientRect();
		var scrollDivX = scrollDivRect.left;
		var kloetzchenX = parseInt( $(self.navMenuItem).css("left"),10 );

		var clickX = event.pageX - scrollDivX;
		clickX = ( clickX < 24 ) ? 24 : clickX;

		self.oldNavItemPos = parseInt( kloetzchenX, 10);
		self.startX = event.pageX;
	
		self.isMouseDown = true;

		if ( (clickX < kloetzchenX) || (clickX > kloetzchenX )) {
			$(self.navMenuItem).css({left: clickX -24});
			self.oldNavItemPos = clickX - 24;

			var scrollRatio = clickX/(self.scrollWidth - 48);
			$(".agenda").css("left", -scrollRatio * self._maxScrollWidth + 0.3 * window.innerWidth );
		}
		
			
	},
	
	mouseUpHandler: function(event) {
		var self = Agenda;
		self.isMouseDown = false;
	},
	
	mouseMoveHandler: function( event ) {

		var self = Agenda;


	if ( self.isMouseDown ) {
			var newItemPos = self.oldNavItemPos + ( event.pageX - self.startX );
			newItemPos = ( newItemPos < 0) ? 0 : newItemPos;
			newItemPos = ( newItemPos > self.scrollWidth - 32) ? self.scrollWidth - 32 : newItemPos;

			$(self.navMenuItem).css("left", newItemPos + "px");
			/*var scrollRatio = newItemPos/(self.scrollWidth -  32);
			$(".agenda").css("left", -scrollRatio * self._maxScrollWidth + 0.28 * window.innerWidth );*/
			self.scrollAgendaAccordingScrollIcon();
			

		}

	},

	mouseScrollHandler: function( event ) {
			var self = Agenda;

			var newItemPos = parseInt( $(".kloetzchen").css("left"), 10) + event.deltaY * 8;
			newItemPos = ( newItemPos < 0) ? 0 : newItemPos;
			newItemPos = ( newItemPos > self.scrollWidth - 32) ? self.scrollWidth - 32 : newItemPos;


			$(self.navMenuItem).css("left", newItemPos + "px");
			var scrollRatio = newItemPos/(self.scrollWidth - 32);
			$(".agenda").stop().animate( {"left": -scrollRatio * self._maxScrollWidth + 0.28 * window.innerWidth }, 100 );

			self.oldNavItemPos = newItemPos;

	},

	touchStartHandler: function( event ) {
		console.log(event.originalEvent.touches[0].pageX);

		var self = Agenda;

		var scrollDivRect = $(".scroll-div")[0].getBoundingClientRect();
		var scrollDivX = scrollDivRect.left;
		var kloetzchenX = parseInt( $(self.navMenuItem).css("left"),10 );


		self.startX = event.originalEvent.touches[0].pageX;
		var clickX = self.startX - scrollDivX;
		clickX = ( clickX < 24 ) ? 24 : clickX;

		self.oldAgendaLeft = parseInt( $(".agenda").css("left"), 10 );
		
	
		self.isTouch = true;

	},

	touchEndHandler: function() {
		var self = Agenda;

		self.isTouch = false;
	},

	touchMoveHandler: function( event ) {

		if (Agenda.isTouch) {
			var self = Agenda;

			/*var newItemPos = parseInt( $(".kloetzchen").css("left"), 10) + event.deltaY * 8;
			newItemPos = ( newItemPos < 0) ? 0 : newItemPos;
			newItemPos = ( newItemPos > self.scrollWidth - 32) ? self.scrollWidth - 32 : newItemPos;*/

			var deltaX = event.originalEvent.touches[0].pageX - self.startX;
			var newLeft = self.oldAgendaLeft + deltaX;

			newLeft = ( newLeft > 0.28 * window.innerWidth ) ? 0.28*window.innerWidth : newLeft;
			newLeft = ( newLeft < (-self._maxScrollWidth - self.eventBoxWidth + 0.6 * window.innerWidth ) ) ? (-self._maxScrollWidth - self.eventBoxWidth + 0.6 * window.innerWidth ) : newLeft ;

			$(".agenda").css("left", newLeft + "px" );
			

			var kloetzchenPos = (0.3 * window.innerWidth - newLeft ) * ( self.scrollWidth - 32 ) / self._maxScrollWidth;
			$(".kloetzchen").css("left", kloetzchenPos );

			/*$(self.navMenuItem).css("left", newItemPos + "px");
			var scrollRatio = newItemPos/(self.scrollWidth - 32);
			$(".agenda").stop().animate( {"left": -scrollRatio * self._maxScrollWidth + 0.28 * window.innerWidth }, 100 );

			self.oldNavItemPos = newItemPos;*/

		} // touchMove Handler

		},
		scrollAgendaAccordingScrollIcon: function( pos ) {
			var self = this;

			var newItemPos = pos || $(self.navMenuItem).css("left");
			console.log(pos + " .. " + newItemPos );
			var scrollRatio = newItemPos/(self.scrollWidth -  32);
			$(".agenda").animate( {"left": -scrollRatio * self._maxScrollWidth + 0.28 * window.innerWidth}, 700 );


		}

	

}; // Agenda