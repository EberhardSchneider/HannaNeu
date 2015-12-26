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
	},


	// navigation -------------------------------------------------------------------------------------------------

	activateNavigation: 	function() {
		var self = Agenda;

		var elements = document.getElementsByClassName('event');

		for ( var index = 0; index < elements.length; index++ ) {
			$(".agenda")[0].addEventListener("mousedown", Agenda.mouseDownHandler, false );
			document.body.addEventListener("mouseup", Agenda.mouseUpHandler, false );
			document.body.addEventListener("mousemove", Agenda.mouseMoveHandler, false );
		}

	
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

		if (!self.isMouseDown) {

			self.isMouseDown = true;
			self.lastT = $.now();

			// change Icon
			$(".agenda").css("cursor", "move");
			
			
			self.draggedObject.domElement = $(this);
			self.draggedObject.x = event.pageX;
			self.draggedObject.y = event.pageY;

			var oldLeftString = $('.agenda').css("left");
			oldLeftString = oldLeftString.substring( 0 , oldLeftString.length - 2);
			self.oldLeftPos = parseInt( oldLeftString );
			self.leftPos = self.oldLeftPos;

		}
		
	},
	
	mouseUpHandler: function(event) {
		var self = Agenda;
		self.scrollSpeed = 0;

		self.isMouseDown = false;
		clearInterval( self.animateHandler );

		// change Icon back
		$(".agenda").css("cursor", "auto");
		
		

		function decelerateScrolling() {
			Agenda.scrollSpeed *= Agenda.deceleration;
			
			var leftStr = $('.agenda').css("left");
			var left = parseInt( leftStr.substring(0, leftStr.length - 2) );
			left -= Agenda.scrollSpeed;
			$('.agenda').css( "left", "" + left + "px" );

			if ( Math.abs( Agenda.scrollSpeed ) < 3  ) {
				clearInterval( Agenda.scrollHandler );
				Agenda.scrolling = false;
			}


		}
	},
	
	mouseMoveHandler: function( event ) {

		var self = Agenda;


		if (Agenda.isMouseDown) {
			
			var deltaX = Agenda.draggedObject.x - event.pageX;
			Agenda.deltaT = $.now() - Agenda.lastT;
			Agenda.lastT = $.now();

			self.leftPos = self.oldLeftPos -  deltaX;

			
			if ( self.leftPos > 350 ) {
				self.leftPos = 300;
				Agenda.isMouseDown = false;
			} else if ( self.leftPos < (-self.timelineLength)  ) {
				self.leftPos = -self.timelineLength ;
				Agenda.isMouseDown = false;
			}
			$(".agenda").css("left", self.leftPos + "px" );
		


		}

	}

}; // Agenda