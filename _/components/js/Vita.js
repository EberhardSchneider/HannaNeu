var Vita = {
	getMarkUp: function() {
		var content = "<div class='vita-wrapper'>";
		content += $(".vita").html();
		content += "</div>";
		return content;
	},

	activate: function() {
		var self = Vita;

		
	},

	deactivate: function() {},

	callback: function() {
	var self = Vita;

		var imageRect = $(".vita-image>img")[0].getBoundingClientRect();
		var pictureRightBounding = parseInt( imageRect.width, 10) + parseInt( imageRect.left, 10);

		var rightBounding = pictureRightBounding > window.innerWidth ? window.innerWidth : pictureRightBounding;

		self.scrollHeight = parseInt( $(".vita-scroll-div").css("height"), 10);  // Höhe des Scroll-Divs
		self._maxScrollHeight = window.getComputedStyle( $(".vita-text")[0], null ).height;
		self._maxScrollHeight = parseInt( self._maxScrollHeight, 10) - 0.5 * window.innerHeight;
		console.log("Height Vita-Text: " +  window.getComputedStyle( $(".vita-text")[0], null ).height);
		console.log("_MaxScrollHeight: " + self._maxScrollHeight);
		self.activateNavigation();

	},

	activateNavigation: 	function() {
		var self = Vita;


		
		$(".vita-scroll-div")[0].addEventListener("mousedown", Vita.mouseDownHandler, false );
		document.body.addEventListener("mouseup", Vita.mouseUpHandler, false );
		document.body.addEventListener("mousemove", Vita.mouseMoveHandler, false );

		self.navMenuItem = $(".vita-kloetzchen")[0];
		

	
	},

	deactivateNavigation: 	function() {
		var self = Vita;

		$(".vita-text")[0],removeEventListener("mousedown", self.mouseDownHandler );
		document.body.removeEventListener("mouseup", self.mouseUpHandler );
		document.body.removeEventListener("mouesemove", self.mosueMoveHandler );
	},

	mouseDownHandler: function( event ) {
		var self = Vita;
		var scrollDivRect = $(".vita-scroll-div")[0].getBoundingClientRect();
		var scrollDivY = scrollDivRect.top;
		var kloetzchenY = parseInt( $(self.navMenuItem).css("top"),10 );

		var clickY = event.pageY - scrollDivY;
		console.log(self._maxScrollHeight);
		self.oldNavItemPos = parseInt( kloetzchenY, 10);
		self.startY = event.pageY;
	
		self.isMouseDown = true;

		if ( (clickY < kloetzchenY) || (clickY > kloetzchenY )) {
			$(".vita-kloetzchen").css({"top": clickY -24});
			self.oldNavItemPos = clickY - 24;

			var scrollRatio = clickY/(self.scrollHeight - 48);
			$(".vita-txt").css("top", -scrollRatio * self._maxScrollHeight );
			console.log(-scrollRatio * self._maxScrollHeight);
		}
		
			
	},
	
	mouseUpHandler: function(event) {
		var self = Vita;
		self.isMouseDown = false;
	},

	mouseMoveHandler: function( event ) {

		var self = Vita;


	if ( self.isMouseDown ) {
			var newItemPos = self.oldNavItemPos + ( event.pageY - self.startY );
			newItemPos = ( newItemPos < 0) ? 0 : newItemPos;
			newItemPos = ( newItemPos > self.scrollHeight - 48) ? self.scrollHeight - 48 : newItemPos;

			$(self.navMenuItem).css("top", newItemPos + "px");
			var scrollRatio = newItemPos/(self.scrollHeight - 48);
			$(".vita-text").css("top", -scrollRatio * self._maxScrollHeight );
			

		}

	}



};