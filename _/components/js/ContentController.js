// class content ------------------------------------------

var Content = (function(window, document, undefined) {
	function Content( getMarkupFunc, activateFunc, deactivateFunc ) {
		this.getMarkUp = getMarkupFunc;
		this.activate = activateFunc;
		this.deactivate = deactivateFunc;
	} // Constructor

	return Content;
})(window, document);


// class ContentController

var ContentController = (function(window, document, undefined) {
	function ContentController( $targetContainer ) {
		this._$targetContainer = $targetContainer;

		this._content = [];
		this._currentMarkUp = "";
		this._currentContentName = "";
	}

	// private -----------------------------------------------------------------------------------

	ContentController.prototype._animateIn = function( duration, callback ) {
		duration = duration || 700;
		// show Content
		this._$targetContainer.fadeIn( duration, callback );
	};

	ContentController.prototype._animateOut = function( duration, callback ) {
		duration = duration || 700;
		// hide Content
		this._$targetContainer.fadeOut( duration, callback );
	};

	// public -------------------------------------------------------------------------------------

	ContentController.prototype.getCurrentContentName = function() {
		return this._currentContentName;
	};

	ContentController.prototype.addContent = function( name, content ) {
		if ( content instanceof Content ) {
			this._content[ name ] = content ;
		} else {
			console.log( name + " is not member of class Content");
		}
	};

	ContentController.prototype.removeContent = function( name ) {
		// removeContent
		if ( this._content[ name ] !== undefined ) {
			delete _this.content[name];
		}
	};

	ContentController.prototype.changeContent = function( name ) {
		var self = this;


		if ( this._content[name] === undefined) {
			console.log( "ContentController: unknown content '" + name + "'" );
			return;
		}
		
		
		if ( this._content[ this._currentContentName ]!== undefined ) {
			this._content[ this._currentContentName ].deactivate();
		}
		
		this._animateOut( 700, function() {
			self._currentMarkUp = self._content[name].getMarkUp();
			self._$targetContainer.empty().html( self._currentMarkUp );
			self._currentContentName = name;

			self._content[ self._currentContentName ].activate();
			self._animateIn();
		});


	


	};


	return ContentController;
})(window, document);