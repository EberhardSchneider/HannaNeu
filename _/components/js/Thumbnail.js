var Thumbnail = (function() {
	function Thumbnail( sourceThumb, sourceBig, thumbClass, bigClass ) {
		this.sourceThumb = sourceThumb;
		this.sourceBig = sourceBig;

		this.thumbClass = thumbClass;
		this.bigClass = bigClass;

		this.thumb_img = undefined; // img-DOM-object
		this.big_img = undefined;

		this._loadThumb();
		this._loadBig();
	}


	Thumbnail.prototype._loadThumb = function() {

		var self = this;

		self.thumb_img = new Image();
		self.thumb_img.src = self.sourceThumb;
		self.thumb_img.class = self.thumbClass;
		
	};

	Thumbnail.prototype._loadBig = function() {

		var self = this;

		self.big_img = new Image();
		self.big_img.src = self.sourceBig;
		self.big_img.class = self.bigClass;

	};

	Thumbnail.prototype.getIndex = function() {
		return parseInt( this.thumbClass.slice(5,-1), 10 );
	};

	return Thumbnail;
})();