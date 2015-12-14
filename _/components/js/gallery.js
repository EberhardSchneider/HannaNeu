var Gallery = {

	numberOfGalleries: 2,

	sourcefileNames: [
		"include/images1.json",
		"include/images2.json"
	],

	galleries: [],

	html: "",

	init: function() {
		var self = this;

		for ( var i = 0; i < self.numberOfGalleries; i++) {
			var g = new GalleryClass( Gallery.sourcefileNames[ i ] );
			g.init();

			Gallery.galleries.push( g );
		}
	},

	activate: function() {
		var self = this;
		
		for ( var i = 0; i < self.numberOfGalleries; i++) {
			Gallery.galleries[ i ].activate();	
		}
	},

	deactivate: function() {
		var self = this;
		
		for ( var i = 0; i < self.numberOfGalleries; i++) {
			Gallery.galleries[ i ].deactivate();	
		}
	},

	getMarkUp: function() {
		var self = this;
		
		var html = "";
		Gallery.html = $("<div class='gallery'>");

		for ( var i = 0; i < self.numberOfGalleries; i++) {
			var $wrapper = $("<div class='gallery-wrapper-" + i + "'>");
			
			$wrapper.append( Gallery.galleries[ i ].getMarkUp() );	
			Gallery.html.append( $wrapper );
		
		}


		return Gallery.html;
	}

};