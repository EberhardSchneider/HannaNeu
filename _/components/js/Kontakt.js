var Kontakt = {
	getMarkUp: function() {
		var content = "<div class='kontakt-wrapper'>"
		content += $(".kontakt").html();
		content += "</div>";
		return content;
	},

	activate: function() {
		var top = parseInt( $(".menu-item").eq(4).css("top"), 10);
		var height = $(".menu-item")[4].getBoundingClientRect().height;
		$(".kontakt-schablone").css( { "height": ( height + 20 ) + "px", top: (top * 1.08 - 10) + "px", display: "none"});
		$(".kontakt-schablone").fadeIn(0);
	},

	deactivate: function() {},

	callback: function() {
	
	}
		

};