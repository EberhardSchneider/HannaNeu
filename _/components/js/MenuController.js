var MenuController = (function(window, document, undefined) {
	
	// speichert MenuStates
	// animiert Wechsel .... besser in VController!!!???


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

		this._isMenuAnimating;

		events.on("stateChanges", function() { self._isMenuAnimating = true;});
		events.on("stateChanged", function() { self._isMenuAnimating = false;});

	}

	MenuController.prototype.render = function() {

		var self = this;
		var newState = this._currentState;
		self._items.forEach(function( elem, index ) {
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
		if (self._propertiesAnimated === 0 ) {
			events.emit("stateChanged");
		}
	};


	MenuController.prototype.addState = function( name, state ) {
		var self = this;
		console.log(name + ": " + self._menuStates.getState(name));
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

		if (this._isMenuAnimating === true) {
			return;
		}


		var newState = self._menuStates.getState( stateName );

		if ( newState === undefined ) {
			console.log( "MenuController: State '" + stateName + "' doesn't exist.");
			return;
		} else if ( newState == this._currentState ) {
			console.log("Already in State");
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