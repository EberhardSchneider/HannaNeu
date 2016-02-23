var Gallery = {



	html: "",

	isOrientationChecked: false, // sind die img mit 'portrait' bzw. 'landscape' Klassen ausgestattet?



	_sceneImageNames: [],
	/*_portraitImageNames: {
		"0": { "thumb": "PORTR_1_THB.jpg",
		"big": "PORTR_1.jpg",
		"comment": "Hanna Herfurtner 2011 Ⓒ Jörg Frank"  },

		"1":	{ "thumb": "PORTR_2_THB.jpg",
		"big": "PORTR_2.jpg",
		"comment": "Hanna Herfurtner 2011 Ⓒ Jörg Frank"  },

				"2":	{ "thumb": "PORTR_3_THB.jpg",
		"big": "PORTR_3.jpg",
		"comment": "Hanna Herfurtner 2011 Ⓒ Jörg Frank"  }
	},*/
	_portraitImageNames: [],
	_sceneImages: [],
	_sceneImagesComments: [],
	_portraitImages: [],
	_portraitImagesComments: [],

	_presentedImageIndex: -1,  // Index des Bildes, das gerade präsentiert wird
	_isPresentedImageSceneImage: false,

	init: function() {
		var self = Gallery;
	

	$.ajax({
		  url: "include/db_scene_images.php",   /* include/db_ajax.php */
			type: 'POST',
			
			dataType: 'json',
			async: false,
		  
		  success:  function( data ) { 

		  var html = "";

			$.each( data, function( key, elem ) {
				self._sceneImageNames.push( elem );
			}); // each

			self._numberOfSceneImages = 0;
			$.each( self._sceneImageNames, function( key, elem ) {
			self._addSceneImage( elem.thumb, elem.big, elem.comment );
			self._numberOfSceneImages++;
		});

		} // success
	});

	$.ajax({
		  url: "include/db_portr_images.php",   /* include/db_ajax.php */
			type: 'POST',
			
			dataType: 'json',
			async: false,
		  
		  success:  function( data ) { 

		  	var html = "";

			$.each( data, function( key, elem ) {
				self._portraitImageNames.push( elem );
			}); // each

			self._numberOfPortraitImages = 0;
			$.each( self._portraitImageNames, function( key, elem ) {
			self._addPortraitImage( elem.thumb, elem.big, elem.comment );
			self._numberOfPortraitImages++;
		});

		} // success
	});


		self._makeHTML();


	},

	activate: function() {
		var self = Gallery;

		// give img containers the correct width

		var imgWidth = 0.254 * window.innerHeight;

		var sceneImagesContainerWidth = imgWidth * Math.floor( self._sceneImages.length / 2) + 1;
		var portraitImagesContainerWidth = imgWidth * self._portraitImages.length + 1;

		
		// jeweils der maximale Wert für left
		self._sceneMaxScrollWidth = (sceneImagesContainerWidth - 0.7 * window.innerWidth);
		self._portraitMaxScrollWidth = (portraitImagesContainerWidth - 0.7 * window.innerWidth);

		$(".scene-images-container").css("width", sceneImagesContainerWidth);
		$(".portrait-images-container").css("width", portraitImagesContainerWidth);

		self.arrowLeft = new Image();
		self.arrowLeft.src = "icons_e/arrow-left.svg";
		self.arrowLeft.className = "arrow-left";

		self.arrowRight = new Image();
		self.arrowRight.src = "icons_e/arrow-right.svg";
		self.arrowRight.className = "arrow-right";



		self.closeIcon = new Image();
		self.closeIcon.src = "icons_e/close_24px.svg";
		self.closeIcon.className = "close-icon";

		self.downloadIcon = new Image();
		self.downloadIcon.src = "icons_e/download_24px.svg";
		self.downloadIcon.className = "download-icon";



		// add orientation classes to images
		if (!self.isOrientationChecked) {
			self.isOrientationChecked = true;

			$.each( self._sceneImages, function(index, elem) {
					var image = elem.getThumb();
					if (image.width > image.height ) {
						$(image).addClass("landscape");
						elem.setBigClass("landscape");
					} else
					{
						$(image).addClass("portrait");
						elem.setBigClass("portrait");
					}
			});

				$.each( self._portraitImages, function(index, elem) {
					var image = elem.getThumb();
					if (image.width > image.height ) {
						$(image).addClass("landscape");
						elem.setBigClass("landscape");
					} else
					{
						$(image).addClass("portrait");
						elem.setBigClass("portrait");
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

		newItemPos = 00;

		$(".sehen-kloetzchen").animate(  {"left": newItemPos}, 500 );
		var scrollRatio = newItemPos/(self.scrollWidth - 32);
		$(".scene-images-container").animate( { "left": -scrollRatio * self._sceneMaxScrollWidth }, 500);
		$(".portrait-images-container").animate( { "left": -scrollRatio * self._portraitMaxScrollWidth }, 500 );
	},

	_activateNavigation: function() {
		var self = Gallery;
		// unbind onclick event for menu managment
		$(self.navMenuItem).off();

		$(".sehen-scroll-div")[0].addEventListener("mousedown", self._mouseDownHandler, false );
		document.body.addEventListener("mouseup", self._mouseUpHandler, false );
		document.body.addEventListener("mousemove", self._mouseMoveHandler, false );

		$(".content").mousewheel( self.mouseScrollHandler );



	},

	_mouseDownHandler: function( event ) {
		var self = Gallery;

		var scrollDivRect = $(".sehen-scroll-div")[0].getBoundingClientRect();
		var scrollDivX = scrollDivRect.left;
		var kloetzchenX = parseInt( $(self.navMenuItem).css("left"),10 );

		var clickX = event.pageX - scrollDivX;
		clickX = ( clickX < 24 ) ? 24 : clickX;

		self.oldNavItemPos = kloetzchenX;
		self.startX = event.pageX;
		self.isMouseDown = true;

		if ( (clickX < kloetzchenX) || (clickX > kloetzchenX )) {
			$(self.navMenuItem).css({left: clickX -24});
			self.oldNavItemPos = clickX - 24;

			var scrollRatio = clickX/(self.scrollWidth - 48);
			$(".scene-images-container").css("left", -scrollRatio * self._sceneMaxScrollWidth );
			/*$(".portrait-images-container").css("left", -scrollRatio * self._portraitMaxScrollWidth );*/
			$(".portrait-images-container").css("left", -scrollRatio * self._sceneMaxScrollWidth );
		}
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
		$(".content").off();  // deactivate mousewheel functionality
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
		contentWrapper.append( $("<div class='sehen-scroll-div-wrapper'><div class='sehen-scroll-div'><div class='strich'></div><div class='sehen-kloetzchen'></div></div></div>"));

		Gallery.html = contentWrapper;


	},

	_addSceneImage: function( sourceThumb, sourceBig, comment ) {
		var self = Gallery;
		// add and Preload Image

		var index = self._sceneImages.length + 1;
		self._sceneImages.push( new Thumbnail( "images/"+sourceThumb, "images/"+sourceBig, "thumb_" + index, "big_"+index ));
		self._sceneImagesComments.push( comment );
	},

		_addPortraitImage: function( sourceThumb, sourceBig, comment ) {
		var self = Gallery;
		// add and Preload Image

		var index = self._portraitImages.length + 1;
		self._portraitImages.push( new Thumbnail( "images/"+sourceThumb, "images/"+sourceBig, "thumb_" + index, "big_"+index ));
		self._portraitImagesComments.push( comment );
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
		

		$(".arrow-right").click( self._arrowRightClickHandler.bind(self) );
		$(".arrow-left").click( self._arrowLeftClickHandler.bind(self) );


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

		self._sceneImages[index]._loadBig();
		var image = self._sceneImages[index].getBig();
		image.className = self._sceneImages[index].bigClass;

		var clickedImage = $(".scene-images-container>div").eq(index).find("img")[0];

		/*console.log(clickedImage);*/
		
	
		$image = $(image);


		var comment = $("<div class='image-comment'>" + self._sceneImagesComments[index] + "</div>");

/*
		presentation.className += " " + image.className;*/
		

		presentation.appendChild( $image[0] );
		presentation.appendChild( comment[0] );

		

		overlay.appendChild( presentation );
		overlay.appendChild( self.closeIcon );
		overlay.appendChild( self.arrowLeft );
		overlay.appendChild( self.arrowRight );

		self._isPresentedImageSceneImage = true;

		$("body").append( overlay );

	},

	_presentPortraitImage: function( index ) {
		var self = Gallery;

		$(".overlay").remove();

		var overlay = document.createElement("div");
		overlay.className = "overlay";

		var presentation = document.createElement("div");
		presentation.className = "presentation";

		self._portraitImages[index]._loadBig();
		var image = self._portraitImages[index].getBig();
		image.className = self._portraitImages[index].bigClass;
		/*var clickedImage = $(".portrait-images-container>div").eq(index).find("img")[0];
		image.src = clickedImage.src;
		image.className = clickedImage.className;*/
		$image = $(image);


		var downloadLink = $("<a href = '" + [ "image_download/PORTR_1_FULL.jpg", "image_download/PORTR_2_FULL.jpg", "image_download/PORTR_3_FULL.jpg" ] [ index ] + "' class='download-icon' download data-tooltip='In voller Qualität herunterladen.'></a> ")[0];

		downloadLink.appendChild( self.downloadIcon );

		var comment = $("<div class='image-comment'>" + self._portraitImagesComments[index] + "</div>");

		presentation.appendChild( $image[0] );
		presentation.appendChild( comment[0] );


		overlay.appendChild( presentation );
		overlay.appendChild( self.closeIcon );
		overlay.appendChild( downloadLink );
		overlay.appendChild( self.arrowLeft );
		overlay.appendChild( self.arrowRight );

		self._isPresentedImageSceneImage = false;


		$("body").append( overlay );

	},

	_closeImage: function() {
		$(".overlay").remove();
	},



	_arrowLeftClickHandler: function() {

		var self = Gallery;
		var currentIndex = self._presentedImageIndex;
		currentIndex--;

		

		if ( self._isPresentedImageSceneImage) {
			if ( currentIndex < 0 ) {
			currentIndex = self._numberOfSceneImages-1;
			}
		 	self._presentSceneImage( currentIndex );
		} else {
			if ( currentIndex < 0 ) {
			currentIndex = self._numberOfPortraitImages-1;
			}
			self._presentPortraitImage( currentIndex );
		}

		$(".arrow-right").click( self._arrowRightClickHandler.bind(self) );
		$(".arrow-left").click( self._arrowLeftClickHandler.bind(self) );
		// close Icon eventListener
		$(".close-icon").on("click", self._closeImage );

		self._presentedImageIndex = currentIndex;

	},

	_arrowRightClickHandler: function() {
		var self = Gallery;
		var currentIndex = self._presentedImageIndex;
		currentIndex++;

		if (self._isPresentedImageSceneImage) {
			if ( currentIndex >= (self._numberOfSceneImages) ) {
				currentIndex = 0;
			}
			Gallery._presentSceneImage( currentIndex );
		} else {
			if ( currentIndex >= (self._numberOfPortraitImages) ) {
				currentIndex = 0;
			}
			Gallery._presentPortraitImage( currentIndex );
		}

		$(".arrow-right").click( self._arrowRightClickHandler.bind(self) );
		$(".arrow-left").click( self._arrowLeftClickHandler.bind(self) );
		// close Icon eventListener
		$(".close-icon").on("click", self._closeImage );

	self._presentedImageIndex = currentIndex;
	}, // _arrowRightClickHandler

		mouseScrollHandler: function( event ) {
			var self = Gallery;

			var newItemPos = parseInt( $(".sehen-kloetzchen").css("left"), 10) + event.deltaY * 40;
			newItemPos = ( newItemPos < 0) ? 0 : newItemPos;
			newItemPos = ( newItemPos > self.scrollWidth - 48) ? self.scrollWidth - 48 : newItemPos;

			$(self.navMenuItem).css("left", newItemPos + "px");
			var scrollRatio = newItemPos/(self.scrollWidth - 48);
			$(".scene-images-container").css("left", -scrollRatio * self._sceneMaxScrollWidth );
			/*$(".portrait-images-container").css("left", -scrollRatio * self._portraitMaxScrollWidth );*/
			$(".portrait-images-container").css("left", -scrollRatio * self._sceneMaxScrollWidth );

			self.oldNavItemPos = newItemPos;

	}


};