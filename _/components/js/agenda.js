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
					besetzung += "<div class='zeile'><span class='rolle'>"+ rolle +":</span><span class='darsteller'>"+ darsteller +"</span></div>";
				});

				html += '<div class="event">
							<div class="event-up">
								<div class="komponist">' + elem.komponist + '</div>
								<div class="title">'+ elem.title +'</div>
								<div class="ort">'+ elem.ort +'</div>
							</div>
							<div class="event-date">
								<div class="datum">'+ elem.datum +'</div>
							</div>
							<div class="event-low">
								<div class="besetzung">'+ besetzung +'</div>
							</div>';

						if ( elem.image !== undefined ) {
							html += ' <div class="event-image"> <img src ="'+ elem.image +'"/> </div>';
						}	

						html += '</div>';
				});		// each

			html += "</div>";

			html += "<div class='scroll-div-wrapper'><div class='scroll-div'><div class='kloetzchen'></div></div><img class='scroll-left' src='icons/arrow-left.svg'/><img class='scroll-right' src='icons/arrow-right.svg'/></div>";
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


	},

	deactivate: function() {
		Agenda.deactivateNavigation();  
	},

	

	// callback after html is inserted
	callback: function() {
		var self = this;

		self.eventBoxWidth = $(".event")[0].getBoundingClientRect().width;
		self.timelineLength = Agenda.numberOfEventboxes * self.eventBoxWidth;
		$(".agenda").css("width", self.timelineLength + "px");

		$(".event-image").click( function() {
			$(this).toggleClass("scroll-out");
		} );

		self.scrollWidth = parseInt( $(".scroll-div").css("width"), 10);  // Breite des Scroll-Divs
		self._maxScrollWidth = window.getComputedStyle( $(".agenda")[0], null )["width"];
		self._maxScrollWidth = parseInt( self._maxScrollWidth, 10) - 0.7 * window.innerWidth;
	},


	// navigation -------------------------------------------------------------------------------------------------

	activateNavigation: 	function() {
		var self = Agenda;


		
		$(".scroll-div")[0].addEventListener("mousedown", Agenda.mouseDownHandler, false );
		document.body.addEventListener("mouseup", Agenda.mouseUpHandler, false );
		document.body.addEventListener("mousemove", Agenda.mouseMoveHandler, false );


		

	
	},

	deactivateNavigation: 	function() {
		var self = Agenda;
		$(".agenda")[0],removeEventListener("mousedown", self.mouseDownHandler );
		document.body.removeEventListener("mouseup", self.mouseUpHandler );
		document.body.removeEventListener("mouesemove", self.mosueMoveHandler );
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
			newItemPos = ( newItemPos > self.scrollWidth - 48) ? self.scrollWidth - 48 : newItemPos;

			$(self.navMenuItem).css("left", newItemPos + "px");
			var scrollRatio = newItemPos/(self.scrollWidth - 48);
			$(".agenda").css("left", -scrollRatio * self._maxScrollWidth + 0.3 * window.innerWidth );
			

		}

	}

}; // Agenda