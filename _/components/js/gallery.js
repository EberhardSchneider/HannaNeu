var Gallery = {

	// navigation ------------------------------------------------------------------------------------------------

	isMouseDown: 	false,

	// auf das geklickt wurde
	draggedObject: 	{
						x: 	0,
						y: 	0,
						domElement: 	{}
					},
					

	// letzter Updatezeitpunkt
	lastT: 		0,
	// letzte linke Position
	oldLeftPos: 0,

	// Bild auswählen
	imageSelectedTimer: 	0,
	imageSelectionThreshold: 	250,


	// images -------------------------------------------------------------------------------------------------------

	sources: 	[
		{
			src: "images/picture_01.jpg",
			alt: "Bild 1"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 2"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 3"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 3"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 3"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 3"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 3"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 3"
		},
		{
			src: "images/picture_01.jpg",
			alt: "Bild 3"
		},

		{
			src: "images/picture_01.jpg",
			alt: "Bild 4"
		}

	], // sources

	images: 	[],

	thumbnails: 	[],


	// Funktionen -----------------------------------------------------------------------------------------------------


	// nur ganz zu Beginn
	init: 	function() {
		var self = Gallery;			
		
		// Bilder laden
		self.loadImages();
		
		// HTML erzeugen
		self.makeHTML();

	},

	// Galerie aktiviert
	activate: function() {
		var self = Gallery;

		// Navigation aktivieren
		self.activateNavigation();
	},

	deactivate: function() {

	},

	getMarkUp: 	function() {
		return Gallery.html;
	},

	// HTML aushängen, Navigation aushängen
	reset: 	function() {
	var self = Gallery;

		// Navigation aushängen
		self.resetNavigation();
	
	},

	// Bilder laden preloaden
	loadImages: function() {
		var self = Gallery;

		// erstmal nur Thumbnails
		self.sources.forEach( function( elem, index ) {
			
			var image = new Image();
			var fileName = elem.src;
			fileName = fileName.substr(0, fileName.lastIndexOf('.')) || fileName;   // Extension entfernen 
			
			image.src = fileName + "_thn.jpg";	
			image.alt = elem. alt;
			image.className = "id_" + index;
			
			//Image in Array
			self.thumbnails.push( image );
		});

		// dann die grossen Bilder
		self.sources.forEach( function( elem ) {
			
			var image = new Image();
			
			image.src = elem.src;
			image.alt = elem.alt;
			
			//Image in Array
			self.images.push( image );
		});
	},

	// HTML erzeugen
	makeHTML: 	function() {
		var self = Gallery;
		
		// Wrapper Klasse
		var gallery = document.createElement("div");
		gallery.className = "gallery";

		// auffüllen
		self.thumbnails.forEach(function( thumb ) {
			$( gallery ). append( thumb );
		});

		self.html = gallery;
	},

	// Navigation einhängen
	activateNavigation: function() {
		var self = Gallery;

		$(".gallery").on("mousedown", self.mouseDownHandler );
		$( "body" ).on("mousemove", self.mouseMoveHandler );
		$( "body" ).on("mouseup", self.mouseUpHandler );

		$(".gallery img").on("click", function() { self.imageSelectedHandler($(this)); } );
	},

	// Navigation aushängen
	resetNavigation: 	function() {

	},

	// Bild auswählen -------------------


	imageSelectedHandler: function( selection ) {
		var self = Gallery;

		// double-click?
		if ( ($.now() - self.imageSelectedTimer) < self.imageSelectionThreshold) {
			self.selectImage( selection );
		}

		self.imageSelectedTimer = $.now();
	},

	selectImage: function( selection ) {
		var self = Gallery;

		var imageID = selection[0].className;
		imageID = imageID.substring(3, imageID.length);
		console.log( imageID );

		var overlay = document.createElement("div");
		overlay.className = "overlay";

		var image = self.images[ imageID ];
		image.className ="presentation";

		var closeIcon = new Image();
		closeIcon.src = "icons/close-icon.svg";
		closeIcon.className = "close-icon";

		overlay.appendChild( image );
		overlay.appendChild( closeIcon );

		$("body").append( overlay );

		// close Icon eventListener
		$(".close-icon").on("click", self.closeImage );
	},

	closeImage: function() {
		var self = Gallery;

		$(".overlay").remove();
	},

	// Navigation Funtionalität -----------------------------------------------------------------------------------------------

	mouseDownHandler: function( event ) {
		var self = Gallery;

		if (!self.isMouseDown) {

			self.isMouseDown = true;
			self.lastT = $.now();
			
			
			self.draggedObject.domElement = $(this);
			self.draggedObject.x = event.pageX;
			self.draggedObject.y = event.pageY;

			var oldLeftString = $('.gallery').css("left");
			oldLeftString = oldLeftString.substring( 0 , oldLeftString.length - 2);
			self.oldLeftPos = parseInt( oldLeftString );

		} // if

		return false;
		
	},
	
	mouseUpHandler: function(event) {

		var self = Gallery;

		self.isMouseDown = false;   // alles zurücksetzen
		self.oldLeftPos = 0;
		self.draggedObject.x = 0;
		self.draggedObject.y = 0;

		// if ( Math.abs( Agenda.scrollSpeed ) > 5 ) {
		// 	Agenda.scrolling = true;
		// 	Agenda.scrollHandler = setInterval( decelerateScrolling, 20, false );
		// }

		// function decelerateScrolling() {
		// 	var self = Gallery;

		// 	self.scrollSpeed *= self.deceleration;
			
		// 	var leftStr = $('.agenda').css("left");
		// 	var left = parseInt( leftStr.substring(0, leftStr.length - 2) );
		// 	left -= self.scrollSpeed;
		// 	$('.gallery').css( "left", "" + left + "px" );

		// 	if ( Math.abs( self.scrollSpeed ) < 3  ) {
		// 		clearInterval( self.scrollHandler );
		// 		self.scrolling = false;
		// 	}
		// }

		return false;
	},
	
	mouseMoveHandler: function( event ) {
		var self = Gallery;

		if (self.isMouseDown) {
			
			var deltaX = self.draggedObject.x - event.pageX;
			self.deltaT = $.now() - self.lastT;
			self.lastT = $.now();
			self.scrollSpeed = deltaX / self.deltaT;

			if ( self.deltaT > 500 ) {
				self.mouseUpHandler();
				console.log('alarm');			
			} // if self.deltaT

			$('.gallery').css( "left", "" + ( self.oldLeftPos - deltaX ) + "px" );
			
		} // if isMouseDown

		return false;


	}


};