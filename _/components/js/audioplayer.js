var AudioPlayer = {


	_html: 	"",   // HTML MarkUp
	// Icons ----------------------------------------------------------------------------

	audioMenuItem: 	{},
	audioMenuItemWidth: 	0,

	pauseIcon: 	{},
	playIcon: {},

	// Audio  -------------------------------------------------------------------------------
	
	isAudioPlaying: 	false,
	trackNumberPlaying: 	-1,
	currentTrackDiv: 	{},
	timeUpdateHandler: 	{},
	navigationUpdateHandler: 	{},

	
	// Navigation ------------------------------------------------------------------------------
	
	isMouseDown: 	false,
	startX: 	0,
	oldItemPos: 	0,
	navPerc: 		0,   // percentage of the windowWith ( pos of the navItem )
	windowWidth: 	0,



	// Audio Daten ------------------------------------------------------------------------------
	audioSources: [
		{ komponist: "Johann Adolf Mozart", titel: "Eine kleine Osterandacht", src: "audio/audio.mp3" },
		{ komponist: "Johann Rainer Mozart", titel: "Eine kleine Pfingstmusik", src: "audio/audio02.mp3" },
		{ komponist: "Johann Adolf Meier", titel: "Eine kleine Osterandacht", src: "audio/audio03.mp3" },
		{ komponist: "Klaus Adolf Mozart", titel: "Eine große Osterandacht", src: "audio/audio04.mp3" },
		{ komponist: "Johann Gustav Schubert", titel: "Eine kleine Verandaschlacht", src: "audio/audio05.mp3" }
	],
	audioElements: [],
	audioElementsLoaded: 	0,



	// Audio und HTML initalisieren
	// TODO aufsplitten in init und acivate
	init:	function() {
		var self = AudioPlayer;

		if (!self.pauseIcon.src) // Play und Pause icons preloaden
		{	
			self.pauseIcon = new Image();
			self.playIcon = new Image();
			self.pauseIcon.src = "icons/pause-icon.svg";
			self.playIcon.src = "icons/play-icon.svg";
			self.playIcon.className = "play-button-img";
			self.pauseIcon.className = "play-button-img";
		
			
			// Audio initialisieren, preloaden
			self.audioSources.forEach(function( elem, index ) {
				self.audioElements[ index ] = new Audio();
				self.audioElements[ index ].src = elem.src;
				self.audioElements[ index ].titel = elem.titel;
				self.audioElements[ index ].komponist = elem.komponist.toUpperCase();

				self.audioElements[ index ].addEventListener("canplaythrough", self.audioReady, false );
			});
		}

		$(".play-button").empty().append( self.playIcon );
	

		// HTML bereiten
		var container = document.createElement("div");
		container.className = "audio";

		var markUp = "";

		self.audioElements.forEach( function( elem ) {
			markUp += "<div class='audio-track'><div class='audio-komponist'>"+ elem.komponist +"</div><div class='audio-titel'>"+ elem.titel +"</div></div>";
		});

		container.innerHTML = markUp;
		

		self._html = container;

		// reset (falls schon mal initialisiert)
		self.isAudioPlaying = false;
		self.trackNumberPlaying = -1;
		self.isMouseDown = false;
		
	},

	activate: function() {
		var self = AudioPlayer;
			// MenuItem speichern
			self.audioMenuItem = $( ".menu-item" )[2];
			// store width and height of "hören" item
			var widthStr = $( self.audioMenuItem ).css("width");
			self.audioMenuItemWidth = parseInt( widthStr.substring( 0, widthStr.length - 2));
		var heightStr = $( self.audioMenuItem ).css("height");
			self.audioMenuItemHeight = parseInt( heightStr.substring( 0, heightStr.length - 2));
			// store onclick event
			self._onClickFunctionOfMenuItem = $._data( self.audioMenuItem, 'events' ).click.handler;
			$(self.audioMenuItem).off();			

			self.windowWidth = window.innerWidth - self.audioMenuItemWidth + 80;

			$(".play-button").on("click", function() { setTimeout( self.playButtonClickHandler, 100); });

			$(".audio").children().each(function( index, elem ){ elem.addEventListener("click", self.audioClicked, false ); });	

	},

	deactivate: function() {
		AudioPlayer.stopCurrentPlaying();
		AudioPlayer.clearAudioNavigation();

		$(".menu-item").eq(2).on( "click", function() { events.emit("itemClicked", $(this).index() ); });
		$(".nav-audio").removeClass("nav-audio");

		$(".play-button").off();
	},

	getMarkUp: function() {
		return this._html;
	},

	playButtonClickHandler: function() {
		var self = AudioPlayer;

		if ( self.isAudioPlaying ) {
			self.stopCurrentPlaying();
			$(".play-button").empty().append(self.playIcon);
		} else {
			$(".play-button").empty().append(self.pauseIcon);
			if (self.trackNumberPlaying == -1) { self.playTrack(0) } 
				else { self.playTrack( self.trackNumberPlaying ); }
		}
	},

	stopCurrentPlaying: function() {
			var self = AudioPlayer;

			if (self.isAudioPlaying) {
				clearInterval( self.timeUpdateHandler );
				self.audioElements[ self.trackNumberPlaying ].pause();
				self.isAudioPlaying = false;
				$(".play-button").empty().append(self.playIcon);
				// self.clearAudioNavigation();
			}
	},

	playNextTrack: function() {
		var self = AudioPlayer;

		var nextAudioTrack;

		if (!self.isAudioPlaying) {
			nextAudioTrack = 0;
		}  else {
			nextAudioTrack = ( (self.trackNumberPlaying+1) == self.audioElements.length ) ? 0 : ( self.trackNumberPlaying + 1 );
		}

		console.log( nextAudioTrack );

		self.playTrack( nextAudioTrack );


	},

	clearAudioNavigation: function() {
		var self = AudioPlayer;


		$(self.audioMenuItem).off( "mousedown");
		document.body.removeEventListener( "mouseup", self.mouseUpHandler);
		document.body.removeEventListener( "mousemove", self.mouseMoveHandler);

		clearInterval( AudioPlayer.navigationUpdateHandler );
		clearInterval( self.timeUpdateHandler );

		//reset Variables
		self.isMouseDown = false;
		self.startX = 0;
		self.oldItemPos = 0;
		self.navPerc =	0;   // percentage of the windowWith ( pos of the navItem )

	},

	playTrack: function( trackToPlay ) {
		var self = AudioPlayer;
		// jede Animation zur Sicherheit stoppen und Audio
		$( self.audioMenuItem ).stop();

		if (self.isAudioPlaying) {   // laufenden Track stoppen
			self.stopCurrentPlaying();
		} 


		$(self.audioMenuItem).addClass("nav-audio");
		self.isAudioPlaying = true;

		self.currentTrackDiv = $(".audio-track").eq( trackToPlay );

		if (trackToPlay != self.trackNumberPlaying) { 
			self.audioElements[ trackToPlay ].currentTime = 0;
		}
		

		self.trackNumberPlaying = trackToPlay;
		// Play Icon in Pause Icon ändern
		$(".play-button").empty().append( self.pauseIcon );
		
		$(".selected").removeClass("selected");
		self.currentTrackDiv.addClass("selected");

		// zur Sicherheit erstmal löschen
		clearInterval( self.timeUpdateHandler );
		clearInterval(self.navigationUpdateHandler)	;

		self.timeUpdateHandler = setInterval( self.timeUpdate, 1000 );
		self.navigationUpdateHandler = setInterval( self.navigationUpdate, 30 );
	
		self.audioElements[ trackToPlay ].play();
	
		self.createTime();
		self.createInfoBox();
		self.initAudioNavigation();
		self.timeUpdate();	
	},


	// Track Klick verarbeiten
	audioClicked: function() {
		var self = AudioPlayer;

		// for safety: clear all Navigation Issues
		self.clearAudioNavigation();

		// aktuelle trackNummer speichern
		var trackNumber = $(this).index();
		self.currentTrackDiv = $(this);

		self.playTrack( trackNumber );

		
	},
	

	initAudioNavigation: function() {
		var self = AudioPlayer;

		var audio = self.audioElements[ self.trackNumberPlaying ];
		var element = self.audioMenuItem;

		element.addEventListener( "mousedown", self.mouseDownHandler, false );
		document.body.addEventListener( "mouseup", self.mouseUpHandler, false );
		document.body.addEventListener( "mousemove", self.mouseMoveHandler, false );
	},

	mouseDownHandler: function( event ) {
		var self = AudioPlayer;

		self.isMouseDown = true;
		self.startX = event.pageX;
		var oldItemPosStr = $( self.audioMenuItem ).css("left");
		self.oldItemPos = parseInt( oldItemPosStr.substring(0, oldItemPosStr.length - 2) );

		self.audioElements[ self.trackNumberPlaying ].pause();
		clearInterval( self.navigationUpdateHandler );
		clearInterval( self.timeUpdateHandler );

	},

	mouseUpHandler: function() {
		var self = AudioPlayer;

		if (!self.isMouseDown) { return; }
		self.isMouseDown = false;
		var audio = self.audioElements[ self.trackNumberPlaying ];
		audio.currentTime = self.navPerc * audio.duration / 100 ;
		if ( self.isAudioPlaying ) audio.play();

		clearInterval( self.navigationUpdateHandler );
		clearInterval( self.timeUpdateHandler );

		self.timeUpdateHandler = setInterval( self.timeUpdate, 1000 );
		self.navigationUpdateHandler = setInterval( self.navigationUpdate, 30 );

	},

	mouseMoveHandler: function( event ) {
		var self = AudioPlayer;


		if (self.isMouseDown) {
			var deltaX = event.pageX - self.startX;
			var newLeft = self.oldItemPos + deltaX;

			
			
			var perc = ( (newLeft - 74) * 100 / ( self.windowWidth - self.audioMenuItemWidth - 60)  );
			perc = ( perc > 100 ) ? 100 : perc;
			perc = ( perc < 0 ) ? 0 : perc;

			self.navPerc = perc;

			var audio = self.audioElements[ self.trackNumberPlaying ];

			audio.currentTime = self.navPerc * audio.duration / 100 ;

			// newLeft = perc * windowWidth / 100;			
			// $( self.audioMenuItem ).css("left", newLeft + "px");

			self.navigationUpdate();
			self.timeUpdate();

		}
	},



	navigationUpdate: function() {
		var self = AudioPlayer;


		var audio = self.audioElements[ self.trackNumberPlaying ];
		var perc = audio.currentTime / audio.duration;


		if ( (( audio.duration - audio.currentTime ) < 1) && (!self.isMouseDown) ) {
			self.playNextTrack();
		}


		var leftPosMenuItem = perc * ( window.innerWidth - self.audioMenuItemWidth - 60) + 74;
		
		$(  self.audioMenuItem ).css("left", leftPosMenuItem + "px"  );
	},

	

	timeUpdate: function() {
		var self = AudioPlayer;

		var seconds = Math.floor( self.audioElements[ self.trackNumberPlaying ].currentTime );
		var minutes = Math.floor( seconds / 60 );
		seconds -= minutes*60;

		$(".time-box").text( self.formatTime(minutes, seconds) );
	},

	formatTime: function ( minutes, seconds ) {

	   var string = "";
	   string += "" + minutes;
	   seconds = "" + seconds;
	   while ( seconds.length < 2) { seconds = "0" + seconds; }
	   string += ":" + seconds;
	   return string; 

	},

	createTime: function() {
		$(".time-box").remove();

		var timeBox = document.createElement('div');
		timeBox.className = "time-box";

		$(".content").append( timeBox );



	},

	// Info über den Audio Track
	createInfoBox: function() {

		var self = AudioPlayer;

		$(".audio-info-box").remove();

		var box = document.createElement('div');
		box.className = "audio-info-box";
		box.innerHTML = "<span class='ort'>Kärnten</span><span class='jahr'>2014</span><span class='besetzung'>Sopran: Hanna herfurtner</span>";


		self.currentTrackDiv.append( box );



		// Box nach oben klappen?

		var rect = self.currentTrackDiv[0].getBoundingClientRect();
		var topTrack = rect.top + 16;
		var heightBoxStr = $('.audio-info-box').css("height");
		var heightBox = parseInt( heightBoxStr.substring( 0 , heightBoxStr.length-2) );
		var bodyHeight = window.innerHeight;

		if ( parseInt(topTrack + heightBox) > window.innerHeight ) {
			$('.audio-info-box').css("bottom", (window.innerHeight - topTrack + 20) + "px" );
			$(".time-box").css("top", ( topTrack  ) + "px" );

		}  else {
			$(".time-box").css("top", ( topTrack - 40 ) + "px" );
		}

		// Time Box justieren
	},

	// Audio LoadManager
	audioReady: function() {
		var self = AudioPlayer;

		self.audioElementsLoaded += 1;

		if ( self.audioElementsLoaded == self.audioElements.length ) {
		}

	}

}