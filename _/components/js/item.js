var Item = (function() {
	
	function Item( $obj, x, y, width, fontSize ) {
		this._$obj = obj;
		this._x = x ;
		this._y = y;
		this._width = width;
		this._fontSize = fontSize;

		this._init();
	}

	// private Sector ------------------------------------------------------------------------------------------------

	Item.prototype._init = function() {
		// calculate optimized Width
	};

	// apply to $obj 
	Item.prototype._render = function() {

	};

	// animation functions

	Item.prototype._animateXY = function( newX,newY ) {
		// default animation function
	};

	Item.prototype._animateWidth = function( newWidth ) {
		// default animation function
	};

	Item.prototype._animateFontSize = function( newFontSize ) {
		// default animation function
	};

	// public sector ---------------------------------------------------------------------------------------------------

	Item.prototype.setAnimationFunction = function( key, func ) {
		// key = "xy" "width" or "fontSize"
	};

	Item.prototype.stretch = function( newWidth ) {
		// stretch() sets to optimum
	};

	Item.prototype.move = function( newX, newY ) {
		// 
	};

	Item.prototype.changeFontSize = function( newFontSize ) {

	};

	return Item;
})();