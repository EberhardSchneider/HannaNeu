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

		var imgWidth = 0.21 * window.innerHeight;

		var sceneImagesContainerWidth = imgWidth * Math.floor( self._sceneImages.length / 2) + 1;
		var portraitImagesContainerWidth = imgWidth * self._portraitImages.length + 1;

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


	/// navigation init

	

	self.navMenuItem = $( ".menu-item" )[3]; // store "sehen" item

	self._navItemStartPos = parseInt( $(self.navMenuItem).css("left"), 10);
	console.log(self._navItemStartPos);
	// store width and height of "sehen" item
	var widthStr = $( self.navMenuItem ).css("width");
	self.navMenuItemWidth = parseInt( widthStr.substring( 0, widthStr.length - 2));
	var heightStr = $( self.navMenuItem ).css("height");
	self.navMenuItemHeight = parseInt( heightStr.substring( 0, heightStr.length - 2));
	
	

	self._activateNavigation();

	self.windowWidth = window.innerWidth - self.navMenuItemWidth + 80;
		
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

	/*	var self = Gallery;
			// set container-width

		// get Container-Width
		var width = $(".scene-div-0")[0].getBoundingClientRect().width;
		var sceneContainerWidth = Math.floor(self._sceneImages.length/2) * width;
		$(".scene-images-container").css("width", sceneContainerWidth); */
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

		self.oldNavItemPos = parseInt( self.navMenuItem.style.left, 10);
		self.startX = event.pageX;
		console.log(self.oldNavItemPos + " .. : .. "+ self.startX);
		self.isMouseDown = true;
	},

	_mouseUpHandler: function() {
		Gallery.isMouseDown = false;
	},

	_mouseMoveHandler: function( event ) {
		var self = Gallery;

		if ( self.isMouseDown ) {
			var newItemPos = self.oldNavItemPos + ( event.pageX - self.startX );
			newItemPos = ( newItemPos < self._navItemStartPos ) ? self._navItemStartPos : newItemPos;

			$(self.navMenuItem).css("left", newItemPos + "px");
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

		Gallery.html = wrapper;


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
	}

};