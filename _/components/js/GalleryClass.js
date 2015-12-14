var GalleryClass = (function() {
	
	function GalleryClass( jsonSources ) {
			// privat ------------------------------

			this._images = [];
			this._imageFilenames = [];

			this._sources = jsonSources;

			this._isMouseDown = false;

			this._draggedObject = {
				x: 0,
				y: 0,
				domElement: {}
			};

			this.lastT = 0;
			this.oldLeftPos = 0;

			this.selectedImageTimer = 0;
			this.selectedImageThreshold = 250;


	}

// Private ------------------------------------------------------

	GalleryClass.prototype._makeHTML = function() {
		var self = this;

		// rapper div
		var gallery = document.createElement("div");
		gallery.className = "gallery";

		// insert images
		self._images.forEach( function(elem) {
			$( gallery ).append( elem.getThumb() );
		});

		self.html = gallery;

		return;
	};

	GalleryClass.prototype._getSourceNames = function() {
		
		var self = this;

		$.ajax({
		  dataType: "json",
		  url: self._sources,
		  
		  success:  function( data ) { 

		  

				$.each( data, function( key, elem ) {
					self._imageFilenames.push( elem );
					self.addImage( elem.thumb, elem.big );
				});		// each

				self._makeHTML();

			} // success
		}); // ajax
	};








// Public ------------------------------------------------------------

	GalleryClass.prototype.addImage = function( sourceThumb, sourceBig ) {
		var self = this;
		// add and Preload Image

		var index = self._images.length + 1;
		self._images.push( new Thumbnail( "images/"+sourceThumb, "images/"+sourceBig, "thumb_" + index, "big_"+index ));

	};

	GalleryClass.prototype.init = function() {
			var self = this;
			// Preload Images
			self._getSourceNames();

	};

	GalleryClass.prototype.activate = function() {
			// activate Navigation
	};

	GalleryClass.prototype.deactivate = function() {
			// deactivate Navigation
	};

	GalleryClass.prototype.callback = function() {
			// not needed in the moment
	};

	GalleryClass.prototype.getMarkUp = function() {
		return $(this.html).html();
	};


	return GalleryClass;

})();