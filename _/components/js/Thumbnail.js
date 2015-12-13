var Thumbnail = (function() {
	function Thumbnail( sourceThumb, sourceBig, thumbClass, bigClass, thumbWidth, thumbHeight ) {
		this.sourceThumb = sourceThumb;
		this.sourceBig = sourceBig;

		this.thumbClass = thumbClass;
		this.bigClass = bigClass;
		this.thumbWidth = thumbWidth;
		this.thumbHeight = thumbHeight;

		this.thumb_img = undefined; // img-DOM-object
		this.big_img = undefined;
	}


	Thumbnail.prototype.loadThumb = function() {

		var self = this;

		self.thumb_img = new Image( self.thumbWidth, self.thumbHeight);
		self.thumb_img.src = self.sourceThumb;
		self.thumb_img.class = self.thumbClass;
		
	};

	Thumbnail.prototype.loadBig = function() {

	var self = this;

	self.big_img = new Image();
	self.big_img.src = self.sourceBig;
	self.big  _img.class = self.big  Class;

	
	};

	return Thumbnail;
})();