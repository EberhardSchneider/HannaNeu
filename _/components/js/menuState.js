// state class

var State = (function() {
	function State( stateArray ) {

		this.x = [];
		this.y = [];
		this.width = [];
		this.fontSize = [];

		for (var i = 0; i < stateArray.length; i--) {
			// menuItems
			this.x.push( stateArray[i].x );
			this.y.push( stateArray[i].y );
			this.width.push( stateArray[i].width );
			this.fontSize.push( stateArray[i].fontSize );
		}
	}

	return State;
})();






var MenuStates = {

	_numberOfItems: 0,
	_states: [],


	addState: function( name, state ) {
		if ( state instanceof State) {
			_states.push( { name: state } );
			_numberOfItems = states.length;
		}
	},

	removeState: function( name ) {
		for ( var i = 0; i < this.states; i++ ) {
			if ( _states[i] == name ) {
				_states.splice( i, 1 );
			}
		}
	},

	getState: function( name ) {
		for ( var i = 0; i < this.states; i++ ) {
			if ( _states[i] == name ) {
				return _states[i];
			}
		}
	}



};