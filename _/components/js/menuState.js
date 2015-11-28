// class State

var State = (function() {
	function State( name, stateArray ) {

		this._name = name;
		this.x = [];
		this.y = [];
		this.width = [];
		this.height = [];
		this.fontSize = [];
		this.opacity = [];

		for (var i = 0; i < stateArray.length; i++) {
			// menuItems
			this.x.push( stateArray[i].x );
			this.y.push( stateArray[i].y );
			this.width.push( stateArray[i].width );
			this.height.push( stateArray[i].height );
			this.fontSize.push( stateArray[i].fontSize );
			this.opacity.push( stateArray[i].opacity );

		}
	}
	State.prototype.getName = function() {
		return this._name;
	};

	return State;
})();  // class State



var MenuStates = (function(window, document, undefined) {
	
	function MenuStates() {

		var self = this;
		
		this._numberItems = 0;
		this._states = [];
		
	
	}

	// private --------------------------------------------------------------------------------------------------------------


	// public ---------------------------------------------------------------------------------------------------------------



	// state management

	
	MenuStates.prototype.addState = function( name, s) {
		if ( s instanceof State) {
			this._states[ name ] = s;
			this._numberOfItems = this._states.length;
		} else console.log("MenuStates: Couldn't add state " + s + "." );
	};

	
	MenuStates.prototype.removeState = function( name ) {	
		delete this._states[ name ];
		this._numberOfItems = this._states.length;
	};

	
	MenuStates.prototype.getState = function( name ) {
		return this._states[ name ] ;
	};



	return MenuStates;

})(window, document);