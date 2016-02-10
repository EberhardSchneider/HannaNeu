var Kontakt = {
	getMarkUp: function() {
		var content = "<div class='kontakt-wrapper'>"
		content += $(".kontakt").html();
		content += "</div>";
		return content;
	},

	activate: function() {
		var self = Kontakt;

		var top = parseInt( $(".menu-item").eq(4).css("top"), 10);
		var height = $(".menu-item")[4].getBoundingClientRect().height;
		$(".kontakt-schablone").css( { "height": ( height + 20 ) + "px", top: (top * 1.08 - 10) + "px", display: "none"});
		$(".kontakt-schablone").fadeIn(0);

		$(".impressum-link")[0].addEventListener("click", self.showImpressum );

		self.closeIcon = new Image();
		self.closeIcon.src = "icons_e/close_24px.svg";
		self.closeIcon.className = "close-icon";
	},

	deactivate: function() {},

	callback: function() {
	
	},

	showImpressum: function() {
		var self = Kontakt;

		var overlay = $("<div class = 'impressum-overlay'></div>");
		overlay.append( self.closeIcon );

		var impressumDiv = $("<div class='impressum'></div>");

		impressumDiv.append( $(".impressum-text").html() );
		overlay.append(impressumDiv);

		$("body").append( overlay );

		$(".close-icon")[0].addEventListener("click", function() {
			$(".impressum-overlay").remove();
		});


	}
		

};