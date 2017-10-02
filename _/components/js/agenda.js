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
	upcomingEvent: 0,

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
		  
		  url: "include/db_events.php",
		  type: 'POST',
			
			dataType: 'json',
			async: false,
		  
		  success:  function( data ) { 

		  	
		  	today = new Date();
		  	console.log(today);
		  	

		  	var html = "<div class='agenda'><div class='scroll-container'>";

			$.each( data, function( key, elem ) {
				
				var besetzung = "";
				Agenda.numberOfEventboxes++;

				elem.besetzung = $.parseJSON( elem.besetzung );
				var dateStr=elem.datum; 
				var a=dateStr.split(" ");
				var d=a[0].split("-");
				var t=a[1].split(":");
				var datum = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
				if (datum < today) {
					Agenda.upcomingEvent = key;
				}

				if (datum.getHours() == 0) { 
					var options = { year: 'numeric', month: 'long', day: 'numeric' };
				}
				else {
					var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
				}
				elem.datum = datum.toLocaleDateString("de-De", options).replace(":", "h");

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
							

						if ( elem.image !== undefined ) {
							html += '<div class="card flippable"><div class="event-low flipped"><div class="besetzung">'+ besetzung +'</div></div>';

							html += ' <div class="event-image"> <img src ="'+ elem.image +'"/> </div></div>';
						} else {
							html += '<div class="card"><div class="event-low"><div class="besetzung">'+ besetzung +'</div></div></div>';
						}

						html += '</div>';
				});		// each

			html += "</div></div>";

			//html += "<div class='scroll-div-wrapper'><div class='scroll-div'><div class='kloetzchen'></div><div class='strich'></div></div></div>";
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
		$(".scroll-container").css("width", self.timelineLength + "px");

		$(".agenda").mCustomScrollbar({
			axis: "x",
			autoHideScrollbar: false
		});



		$(".flippable").click( function() {
			$("div", this).toggleClass("flipped");
		} );


		// // set right Event in place
		console.log(Agenda.upcomingEvent);
		var leftPosAtStart = $(".event").eq(Agenda.upcomingEvent+1).position().left;
		console.log( leftPosAtStart );
		$(".agenda").mCustomScrollbar("scrollTo",leftPosAtStart+"");



	},


	// navigation -------------------------------------------------------------------------------------------------

	activateNavigation: 	function() {
		var self = Agenda;

	
	}


	

}; // Agenda