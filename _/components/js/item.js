var Item = (function() {
	
	function Item( $obj, x, y, width, height, fontSize, opacity, browser ) {
		this._$obj = $obj;
		this._$svg = $obj.find("svg");
		this._$text = $obj.find("text");
		this._x = x ;
		this._y = y;
		this._width = width;
		this._height = height;
		this._fontSize = fontSize;
		this._opacity = opacity;

		this._browser = browser;

		this._init();
	}

	// private Sector ------------------------------------------------------------------------------------------------

	Item.prototype._init = function() {
		// textLength must be prepared
		if (this._$text.length != 0) {
		this._$text[0].setAttribute( "textLength", 300); 
		}
	
	};

	// apply to $obj 
	Item.prototype._render = function() {

	};

	// animation functions

	Item.prototype._animateXY = function( newX, newY, callback, duration ) {
		// default animation function
		var self = this;
		duration = duration || 1.5;



		TweenMax.to( self._$obj, duration, { left: newX, top: newY, onComplete: callback, ease: Power1.easeInOut } );

	};

	Item.prototype._animateWidth = function( newWidth, callback, duration ) {
		// default animation function
		var self = this;
		duration = duration || 1.5;

		if (newWidth == -1) {
			TweenMax.to( self._$svg, duration, {  width: 300, onComplete: callback, ease: Back.easeInOut  });
			return;
		}

		TweenMax.to( self._$svg, duration, { "width": newWidth, onComplete: callback, ease: Back.easeInOut  });
		if (self._$text) { 
			TweenMax.to( self._$text, duration, { attr:{ "textLength": ( (newWidth>5) ? newWidth-5 : 0) }, ease: Back.easeInOut  } );
		}

		if ( self._$obj.find("img") ) {
				TweenMax.to( self._$obj.find("img"), duration, {  "width": newWidth, ease: Back.easeInOut });
		}

	};

	Item.prototype._animateHeight = function( newHeight, callback, duration ) {
		// default animation function
		var self = this;
		duration = duration || 1.5;
		console.log(self.browser);
		self._$svg.attr( { height: newHeight });
		if ( (this._browser != "Firefox") && (this._browser != "Microsoft Internet Explorer") && (this._browser != "Safari")) {
			self._$text.attr( { y: (newHeight - 5) });
		} else {
			self._$text.attr( { y: -5 });
		}

		TweenMax.to( self._$svg, duration, { attr: { "height": newHeight }, onComplete: callback} );
		TweenMax.to( self._$text, duration, { "y": newHeight } );

	};

	Item.prototype._animateFontSize = function( newFontSize, callback, duration ) {
		// default animation function
		var self = this;
		duration = duration || 1.5;
		if (self._$text == undefined) { return; }
		TweenMax.to(self._$obj, duration, { y: newFontSize*7.5, onComplete: callback, ease: Power1.easeInOut  } );
		TweenMax.to( self._$text, duration, { "font-size": newFontSize*15, ease: Power1.easeInOut });

	};

	Item.prototype._animateOpacity = function( newOpacity, callback, duration ) {
		// default animation function
		var self = this;
		duration = duration || 1.5;

		TweenMax.to( self._$obj, duration, { "opacity": newOpacity, onComplete: callback });


	};

	// public sector ---------------------------------------------------------------------------------------------------

	Item.prototype.setAnimationFunction = function( key, func ) {
		// key = "xy" "width" or "fontSize"
	};

	Item.prototype.stretch = function( newWidth, callback ) {
		if ( this._width != newWidth ) {
			this._width = newWidth;
			this._animateWidth( newWidth, callback  );
		} else { callback(); }
	};

	Item.prototype.move = function( newX, newY, callback ) {
		if ( (this._x != newX) || (this._y != newY) ) {
			this._x = newX;
			this._y = newY;
			this._animateXY( newX, newY, callback  );
		} else { callback(); } 
	};

	Item.prototype.changeHeight = function( newHeight, callback ) {
		if ( this._height != newHeight ) {
			this._height = newHeight;
			this._animateHeight( newHeight, callback  );
		} else { callback(); }
	};

	Item.prototype.changeFontSize = function( newFontSize, callback ) {
		if (this._fontSize != newFontSize ) {
			this._fontSize = newFontSize;
			this._animateFontSize( newFontSize, callback  );
		} else { callback(); }
	};

	Item.prototype.changeOpacity = function( newOpacity, callback ) {
		if (this._opacity != newOpacity ) {
			this._opacity = newOpacity;
			this._animateOpacity( newOpacity, callback  );
		} else { callback(); }
	};

		// apply to $obj 
	Item.prototype.render = function( newX, newY, newWidth, newHeight, newFontSize, newOpacity ) {
		var self = this;
		this._x = newX || this._x;
		this._y = newY || this._y;
		this._width = newWidth || this._width;
		this._height = newHeight || this._height;
		this._fontSize = newFontSize || this._fontSize;
		this._opacity = newOpacity || this._opacity;

		this._animateXY( self._x, self._y, function() {}, 0.1  );
	};



	return Item;
})();