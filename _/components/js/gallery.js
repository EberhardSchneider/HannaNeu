var Gallery = {



	html: "",

	isOrientationChecked: false,

	_sceneImageNames: {
		"0": { "thumb": "aschenputtel_hut.png",
					"big" : "aschenputtel_hut.png" },

		"1": { "thumb": "aschenputtel_kleider.png",
					"big" : "aschenputtel_kleider.png" },

		"2": { "thumb": "aschenputtel_lachend.png",
					"big" : "aschenputtel_lachend.png" },

		"3": { "thumb": "gisela_abteil.png",
					"big" : "gisela_abteil.png" },

		"4": { "thumb": "gisela_gold.png",
					"big" : "gisela_gold.png" },

		"5": { "thumb": "judy_punch.jpeg",
					"big" : "judy_punch.jpeg" },

		"6": { "thumb": "papagena_ei.png",
					"big" : "papagena_ei.png" },

		"7": { "thumb": "what_what.jpg",
					"big" : "what_what.jpg" },
		"8": { "thumb": "gisela_abteil.png",
					"big" : "gisela_abteil.png" },

		"9": { "thumb": "gisela_gold.png",
					"big" : "gisela_gold.png" },

		"10": { "thumb": "judy_punch.jpeg",
					"big" : "judy_punch.jpeg" },

		"11": { "thumb": "papagena_ei.png",
					"big" : "papagena_ei.png" },

		"12": { "thumb": "what_what.jpg",
					"big" : "what_what.jpg" }

	},
	_portraitImageNames: {
		"0": { "thumb": "portrait_1.jpg",
		"big": "portrait_1.jpg" },

		"1":	{ "thumb": "portrait_2.jpg",
			"big": "portrait_2.jpg" },

				"2":	{ "thumb": "portrait_2.jpg",
			"big": "portrait_2.jpg" },

				"3":	{ "thumb": "portrait_2.jpg",
			"big": "portrait_2.jpg" }
	},
	_sceneImages: [],
	_portraitImages: [],

	_presentedImageIndex: -1,  // Index des Bildes, das gerade präsentiert wird

	init: function() {
		var self = Gallery;


		$.each( self._sceneImageNames, function( key, elem ) {
			self._addSceneImage( elem.thumb, elem.big );
		});
		$.each( self._portraitImageNames, function( key, elem ) {
			self._addPortraitImage( elem.thumb, elem.big );
		});

		self._makeHTML();


	},

	activate: function() {
		var self = Gallery;

		// give img containers the right width

		var imgWidth = 0.3 * window.innerHeight;

		var sceneImagesContainerWidth = imgWidth * Math.floor( self._sceneImages.length / 2) + 1;
		var portraitImagesContainerWidth = imgWidth * self._portraitImages.length + 1;

		
		
		self._sceneMaxScrollWidth = (sceneImagesContainerWidth - 0.7 * window.innerWidth);
		self._portraitMaxScrollWidth = (portraitImagesContainerWidth - 0.7 * window.innerWidth);

		$(".scene-images-container").css("width", sceneImagesContainerWidth);
		$(".portrait-images-container").css("width", portraitImagesContainerWidth);



		// add orientation classes to images
		if (!self.isOrientationChecked) {
			self.isOrientationChecked = true;

			$.each( self._sceneImages, function(index, elem) {
					var image = elem.getThumb();
					if (image.width > image.height ) {
						$(image).addClass("landscape");
					} else
					{
						$(image).addClass("portrait");
					}
			});

				$.each( self._portraitImages, function(index, elem) {
					var image = elem.getThumb();
					if (image.width > image.height ) {
						$(image).addClass("landscape");
					} else
					{
						$(image).addClass("portrait");
					}
			});

		}


	/// click handler

	$(".image-wrapper").find("img").click( self._imageClickHandler );

	self.navMenuItem = $(".sehen-kloetzchen")[0];

	

	

	self._activateNavigation();


		
	},

	deactivate: function() {
		var self = Gallery;

		self._deactivateNavigation();
		


		self.isMouseDown = false;
		
	},

	getMarkUp: function() {
		var self = Gallery;
		
		var html = $(".sehen").html();

		return Gallery.html;
	},

	callback: function() {

	 self = Gallery;
	
		self.scrollWidth = parseInt( $(".sehen-scroll-div").css("width"), 10);  // Breite des Scroll-Divs

		newItemPos = 0;

		$(".sehen-kloetzchen").css("left", newItemPos );
		var scrollRatio = newItemPos/(self.scrollWidth - 32);
		$(".scene-images-container").animate( { "left": -scrollRatio * self._sceneMaxScrollWidth }, 500);
		$(".portrait-images-container").animate( { "left": -scrollRatio * self._portraitMaxScrollWidth }, 600 );
	},

	_activateNavigation: function() {
		var self = Gallery;
		// unbind onclick event for menu managment
		$(self.navMenuItem).off();

		self.navMenuItem.addEventListener("mousedown", self._mouseDownHandler, false );
		document.body.addEventListener("mouseup", self._mouseUpHandler, false );
		document.body.addEventListener("mousemove", self._mouseMoveHandler, false );


	},

	_mouseDownHandler: function( event ) {
		var self = Gallery;

		self.oldNavItemPos = parseInt( $(self.navMenuItem).css("left"), 10);
		self.startX = event.pageX;
		console.log(self.oldNavItemPos + " .. : .. "+ self.scrollWidth);
		self.isMouseDown = true;
	},

	_mouseUpHandler: function() {
		Gallery.isMouseDown = false;
	},

	_mouseMoveHandler: function( event ) {
		var self = Gallery;

		if ( self.isMouseDown ) {
			var newItemPos = self.oldNavItemPos + ( event.pageX - self.startX );
			newItemPos = ( newItemPos < 0) ? 0 : newItemPos;
			newItemPos = ( newItemPos > self.scrollWidth - 48) ? self.scrollWidth - 48 : newItemPos;

			$(self.navMenuItem).css("left", newItemPos + "px");
			var scrollRatio = newItemPos/(self.scrollWidth - 48);
			$(".scene-images-container").css("left", -scrollRatio * self._sceneMaxScrollWidth );
			/*$(".portrait-images-container").css("left", -scrollRatio * self._portraitMaxScrollWidth );*/
			$(".portrait-images-container").css("left", -scrollRatio * self._sceneMaxScrollWidth );


		}
	},

	_deactivateNavigation: function() {
		var self=Gallery;
		self.navMenuItem.removeEventListener( "mousedown", self._mouseDownHandler);
		document.body.removeEventListener( "mouseup", self._mouseUpHandler);
		document.body.removeEventListener( "mousemove", self._mouseMoveHandler);

		$(".menu-item").eq(3).on( "click", function() { events.emit("itemClicked", $(this).index() ); });

	},

	_makeHTML: function() {
		var self = Gallery;

		var contentWrapper = $("<div class='gallery-content-wrapper'></div>");

		var wrapper = $("<div class='image-wrapper'>");
		var sceneImagesContainer = $("<div class='scene-images-container'></div>");
		var portraitImagesContainer = $("<div class='portrait-images-container'></div>");

		$.each( self._sceneImages, function( index, elem ) {
			var imageDiv = $("<div class='scene-div-" + index + "'>");
			imageDiv.append(elem.getThumb());
			sceneImagesContainer.append( imageDiv );
		});

		$.each( self._portraitImages, function( index, elem ) {
			var imageDiv = $("<div class='portrait-div-" + index + "'>");

			imageDiv.append(elem.getThumb());
			portraitImagesContainer.append( imageDiv );
		});
		wrapper.append( sceneImagesContainer );
		wrapper.append( portraitImagesContainer );


		contentWrapper.append( wrapper );
		contentWrapper.append( $("<div class='sehen-scroll-div-wrapper'><div class='sehen-scroll-div'><div class='sehen-kloetzchen'></div></div><img class='sehen-scroll-left' src='icons/arrow-left.svg'/><img class='sehen-scroll-right' src='icons/arrow-right.svg'/></div>"));

		Gallery.html = contentWrapper;


	},

	_addSceneImage: function( sourceThumb, sourceBig ) {
		var self = Gallery;
		// add and Preload Image

		var index = self._sceneImages.length + 1;
		self._sceneImages.push( new Thumbnail( "images/"+sourceThumb, "images/"+sourceBig, "thumb_" + index, "big_"+index ));
	},

		_addPortraitImage: function( sourceThumb, sourceBig ) {
		var self = Gallery;
		// add and Preload Image

		var index = self._portraitImages.length + 1;
		self._portraitImages.push( new Thumbnail( "images/"+sourceThumb, "images/"+sourceBig, "thumb_" + index, "big_"+index ));
	},

	_imageClickHandler: function( $img ) {
		var self = Gallery;

		var $parentDiv = $(this).closest("div");

		self._presentedImageIndex = $parentDiv.index();
		var containerClassName = $parentDiv[0].className;

		if (containerClassName.substring(0,3) == "sce") {
			self._presentSceneImage( self._presentedImageIndex );
		} else {
			self._presentPortraitImage( self._presentedImageIndex );
		}
		

		$(".arrow-right").click( self._arrowRightClickHandler.bind(this) );
		$(".arrow-left").click( self._arrowLeftClickHandler.bind(this) );


		// close Icon eventListener
		$(".close-icon").on("click", self._closeImage );
	},

	_presentSceneImage: function( index ) {
		var self = Gallery;
		
		$(".overlay").remove();


		var overlay = document.createElement("div");
		overlay.className = "overlay";

		var presentation = document.createElement("div");
		presentation.className = "presentation";

		var image = new Image();
		var clickedImage = $(".scene-images-container>div").eq(index).find("img")[0];
		console.log(clickedImage);
		image.src = clickedImage.src;
		image.className = clickedImage.className;
		$image = $(image);


		var arrowLeft = new Image();
		arrowLeft.src = "icons/arrow-left.svg";
		arrowLeft.className = "arrow-left";

		var arrowRight = new Image();
		arrowRight.src = "icons/arrow-right.svg";
		arrowRight.className = "arrow-right";



		var closeIcon = new Image();
		closeIcon.src = "icons/close-icon.svg";
		closeIcon.className = "close-icon";

		presentation.appendChild( $image[0] );

		overlay.appendChild( presentation );
		overlay.appendChild( closeIcon );
		overlay.appendChild( arrowLeft );
		overlay.appendChild( arrowRight );

		$("body").append( overlay );

	},

	_presentPortraitImage: function( index ) {
		var self = Gallery;

		$(".overlay").remove();

		var overlay = document.createElement("div");
		overlay.className = "overlay";

		var presentation = document.createElement("div");
		presentation.className = "presentation";

		var image = new Image();
		var clickedImage = $(".scene-images-container>div").eq(index).find("img")[0];
		image.src = clickedImage.src;
		image.className = clickedImage.className;
		$image = $(image);

		var arrowLeft = new Image();
		arrowLeft.src = "icons/arrow-left.svg";
		arrowLeft.className = "arrow-left";

		var arrowRight = new Image();
		arrowRight.src = "icons/arrow-right.svg";
		arrowRight.className = "arrow-right";



		var closeIcon = new Image();
		closeIcon.src = "icons/close-icon.svg";
		closeIcon.className = "close-icon";

		presentation.appendChild( $image[0] );

		overlay.appendChild( presentation );
		overlay.appendChild( closeIcon );
		overlay.appendChild( arrowLeft );
		overlay.appendChild( arrowRight );

		$("body").append( overlay );

	},

	_closeImage: function() {
		$(".overlay").remove();
	},

	_arrowLeftClickHandler: function() {
		var currentIndex = $(this).closest("div").index();
		currentIndex--;
		console.log(currentIndex);
		if ( currentIndex < 0 ) {
			currentIndex = $(this).closest("div").closest("div").children().length;
		}

		Gallery._presentPortraitImage( currentIndex );
		self.currentIndex = currentIndex;

	},

	_arrowRightClickHandler: function() {
		var currentIndex = $(this).closest("div").index();
		currentIndex++;
		console.log(currentIndex);
		if ( currentIndex > $(this).closest("div").closest("div").children().length ) {
			currentIndex = 0;
		}
	

	Gallery._presentPortraitImage( currentIndex );
	self.currentIndex = currentIndex;
	} // _arrowRightClickHandler

};