var MenuController = (function(window, document, undefined) {
	
	// speichert MenuStates
	// animiert Wechsel .... 


	// Constructor -----------------------------------------------------------------------------
	function MenuController( $items, browser ) {

		var self = this;

		this._menuStates = new MenuStates();
		this._items = [];
		this._currentState = "";
		this._propertiesAnimated = 0;

		$items.each( function( index, value ) {
			self._items.push( new Item( $(value), 0, 0, 0, 0, 0, 1, browser));
		});

		this._isMenuAnimating = false;

		events.on("stateChanges", function() { self._isMenuAnimating = true;});
		events.on("stateChanged", function() { });

	}

	MenuController.prototype.render = function() {

		var self = this;
		var newState = this._currentState;
		console.log("MenuController render: " + newState._name );
		self._items.forEach(function( elem, index ) {
			console.log("Rendering index " + index );
			elem.render( 	newState.x[index], 
										newState.y[index], 
										newState.width[index],
									 	newState.height[index], 
									 	newState.fontSize[index], 
									 	newState.opacity[index]);
		});

	};


	MenuController.prototype._propertiesAnimationHandler = function() {
		var self = this;

		self._propertiesAnimated--;
		if (self._propertiesAnimated <= 0 ) {
			events.emit("stateChanged");
			setTimeout( function() {
				self._isMenuAnimating = false;
			 	self._propertiesAnimated = 0;},  250 );	
			 
		}
	};


	MenuController.prototype.addState = function( name, state ) {
		var self = this;
		if ( self._menuStates.getState( name ) !== undefined ) {
			 
			if (self._currentState.getName().trim() == name.trim()) {
				self._currentState = state;
			}
			self._menuStates.removeState( name );
			self._menuStates.addState( name, state );

		} else {
			self._menuStates.addState( name, state );
		} 
		};

	MenuController.prototype.removeState = function( name ) {
		this._menuStates.removeState( name );
	};

	MenuController.prototype.getCurrentStateName = function() {
		if ( this._currentState !== "" ) {
			return this._currentState.getName();
		}

	};


	MenuController.prototype.gotoState = function( stateName ) {
		
		var self = this;

		/*if (this._-imating === true) {
			console.log("...Animating... cant do it!!! ");
			return;
		}
*/

		var newState = self._menuStates.getState( stateName );

		if ( newState === undefined ) {
			console.log( "MenuController: State '" + stateName + "' doesn't exist.");
			return;
		} else if ( newState == self._currentState ) {
			self._isMenuAnimating = false;
			return;
		}

		events.emit("stateChanges");

		self._items.forEach(function( elem, index ) {
			self._propertiesAnimated += 5;
			elem.move( newState.x[index], newState.y[index], self._propertiesAnimationHandler.bind( self ) );
			elem.stretch( newState.width[index] , self._propertiesAnimationHandler.bind( self )  );
			elem.changeHeight( newState.height[index] , self._propertiesAnimationHandler.bind( self )  );
			elem.changeFontSize( newState.fontSize[index] , self._propertiesAnimationHandler.bind( self )  );
			elem.changeOpacity( newState.opacity[index] , self._propertiesAnimationHandler.bind( self )  );
		});

		this._currentState = newState;


	};

	return MenuController;

})(window, document);