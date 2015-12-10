var VController = (function(window, document, undefined) {
	
	function VController() {

		this._menuItems = [ "agenda", "vita", "hören", "sehen", "kontakt" ];
		this._init();
		this.mc.gotoState("home");
	}

	// private -----------------------------------------------------------------------------------------------------

	VController.prototype._init = function() {
		var self = this;

		this._detectBrowser();

		// Menu-Items ----------------------------------------------------------------------------------------------

		var $items = $(".menu-item");
		$items.push( $(".home-button"));
		$items.push( $(".play-button"));
		$items.push( $(".menu-name"));
		$items.push( $(".menu-sopran"));

		self.cc = new ContentController( $(".content"));
		this.mc = new MenuController( $items, this._browser );
		AudioPlayer.init();

		$items.find("text").each( function() { 
			if ($(this) !== undefined) { 
				$(this)[0].setAttribute("textLength", 372 );
				$(this)[0].setAttribute("y", 0);
			}
		});

		Agenda.init();
		Gallery.init();

		// Content Managment ------------------------------------------------------------------------------------------

		self.cc.addContent("agenda", new Content( Agenda.getMarkUp.bind(Agenda), Agenda.activate.bind(Agenda), Agenda.deactivate.bind(Agenda), Agenda.callback.bind(Agenda)));
		self.cc.addContent("vita", new Content( Vita.getMarkUp.bind(Vita), Vita.activate.bind(Vita), Vita.deactivate.bind(Vita)));
		self.cc.addContent("hören", new Content( AudioPlayer.getMarkUp.bind(AudioPlayer), AudioPlayer.activate.bind(AudioPlayer), AudioPlayer.deactivate.bind(AudioPlayer)));
		self.cc.addContent("sehen", new Content( Gallery.getMarkUp.bind(Gallery), Gallery.activate.bind(Gallery), Gallery.deactivate.bind(Gallery)));
		self.cc.addContent("kontakt", new Content( Kontakt.getMarkUp.bind(Kontakt), Kontakt.activate.bind(Kontakt), Kontakt.deactivate.bind(Kontakt), Kontakt.callback.bind(Kontakt)));
		self.cc.addContent("home", new Content( (function() { return ""; }), function(){}, function(){}));


		events.on("resize", function() { self._calculatePositions(); self.mc.render(); });


		this._calculatePositions();

	};


	VController.prototype._manageContent = function( newIndex ) {
		var oldContentName = this.cc.getCurrentContentName();
		
		if ( newIndex == -1) {
			newContentName = "home";
		}
		else {
			newContentName = this._menuItems[ newIndex ];
		}

		this.cc.changeContent( newContentName );
	};

	VController.prototype._calculatePositions = function() {

		// home-State

		var menuTop = window.innerHeight * 0.22;
		var menuItemHeight = window.innerHeight * 0.07;
		var menuLeft = window.innerWidth * 0.3;
		var menuLength = window.innerWidth * 0.25;
		menuLength = (menuLength > 300) ? 300 : menuLength;
		var homeButtonX = 10;
		var homeButtonY = 10;

		var homeFontSize = window.innerHeight * 0.005;
		
		var homeState = [];
		for (var i = 0; i<5; i++ ) {
			var w = [372, 190, 318, 304, 410][i];
			homeState.push( { x: menuLeft, y: menuTop + i*menuItemHeight, width: w , height: menuItemHeight, fontSize: homeFontSize, opacity: 1 });
		}
		homeState.push( { x: homeButtonX, y: homeButtonY, width: 128, height: 128, fontSize: 0, opacity: 0 });  // home-button
		homeState.push( { x: -130, y: menuTop +  2.75 * menuItemHeight, width: 64, height: 64, fontSize: 0, opacity: 0 });  // play-button
		homeState.push( { x: menuLeft - 140, y: menuTop - 104, width: 350, height: 128, fontSize: homeFontSize/2.5, opacity: 1 });  // menu-name
		homeState.push( { x: menuLeft - 140, y: menuTop - 66, width: 150, height: 128, fontSize: homeFontSize/2.5, opacity: 1 });  // menu-sopran
		this.mc.addState("home", new State( "home", homeState) );

		// agenda-State

		var agendaState = [];
		
		this.mc.removeState("agenda");
		agendaState.push({ x: 50, y: menuTop, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - .5, opacity: 1 });
		for (var i = 1; i<5; i++ ) {
			agendaState.push( { x: 10, y: menuTop + i*menuItemHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - 2, opacity: .7});
		}
		agendaState.push( { x: homeButtonX, y:homeButtonY, width: 128, height: 128, fontSize: 0, opacity: 1 });  // home-button
		agendaState.push( { x: -130, y: menuTop +  2.75 * menuItemHeight, width: 64, height: 64, fontSize: 0, opacity: 0 });  // play-button
		agendaState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		agendaState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		


		this.mc.addState("agenda", new State( "agenda", agendaState )); 

		// vita-State

		var vitaState = [];
		
		this.mc.removeState("vita");
		for (var i = 0; i<5; i++ ) {
			if ( i == 1 ) {
				vitaState.push({ x: menuLeft, y: .43 * window.innerHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - .5, opacity: 1 });
			} else {
			vitaState.push( { x: 10, y: menuTop + i*menuItemHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - 2, opacity: .7});
			}
		}
		vitaState.push( { x: homeButtonX, y:homeButtonY, width: 128, height: 128, fontSize: 0, opacity: 1 });  // home-button
		vitaState.push( { x: -130, y: menuTop +  2.75 * menuItemHeight, width: 64, height: 64, fontSize: 0, opacity: 0 });  // play-button
		vitaState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		vitaState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		this.mc.addState("vita", new State( "vita", vitaState ));

		// hören-State

		var hoerenState = [];
		
		this.mc.removeState("hören");
		for (var i = 0; i<5; i++ ) {
			if ( i == 2 ) {
				hoerenState.push({ x: 74, y: menuTop  + i*menuItemHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - .5, opacity: 1 });
			} else {
			hoerenState.push( { x: 10, y: menuTop + i*menuItemHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - 2, opacity: .7});
			}
		}
		hoerenState.push( { x:homeButtonX, y:homeButtonY, width: 128, height: 128, fontSize: 0, opacity: 1 });  // home-button
		hoerenState.push( { x: 5, y: menuTop +  2.75 * menuItemHeight, width: window.innerHeight/15, height:window.innerHeight/15, fontSize: 0, opacity: 1 });  // play-button
		hoerenState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		hoerenState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		this.mc.addState("hören", new State( "hören", hoerenState ));

		// sehen-State

		var sehenState = [];
		
		this.mc.removeState("sehen");
		for (var i = 0; i<5; i++ ) {
			if ( i == 3 ) {
				sehenState.push({ x: 50, y: menuTop  + i*menuItemHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - .5, opacity: 1 });
			} else {
			sehenState.push( { x: 10, y: menuTop + i*menuItemHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - 2, opacity: .7});
			}
		}
		sehenState.push( { x:homeButtonX, y:homeButtonY, width: 128, height: 128, fontSize: 0, opacity: 1 });  // home-button
		sehenState.push( { x: -130, y: menuTop +  2.75 * menuItemHeight, width: 64, height: 64, fontSize: 0, opacity: 0 });  // play-button
		sehenState.push( { x: menuLeft - 50, y: menuTop - 30, width: 0, height: 0, fontSize: 0, opacity: 0 });  // menu-decoration
		sehenState.push( { x: menuLeft - 50, y: menuTop - 30, width: 0, height: 0, fontSize: 0, opacity: 0 });  // menu-decoration
		this.mc.addState("sehen", new State( "sehen", sehenState ));

		// kontakt-State

		var kontaktState = [];
		
		for (var i = 0; i<5; i++ ) {
			if ( i == 4 ) {
				kontaktState.push({ x: window.innerWidth * 0.25, y: menuTop  + i*menuItemHeight, width: menuLength + 20 , height: menuItemHeight, fontSize: homeFontSize - .5, opacity: 1 });
			} else {
			kontaktState.push( { x: 10, y: menuTop + i*menuItemHeight, width: menuLength , height: menuItemHeight, fontSize: homeFontSize - 2, opacity: .7});
			}
		}
		kontaktState.push( { x: homeButtonX, y: homeButtonY, width: 128, height: 128, fontSize: 0, opacity: 1 });  // home-button
		kontaktState.push( { x: -130, y: menuTop +  2.75 * menuItemHeight, width: 64, height: 64, fontSize: 0, opacity: 0 });  // play-button
		kontaktState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		kontaktState.push( { x: menuLeft - 50, y: menuTop - 30, width: 128, height: 128, fontSize: 0, opacity: 0 });  // menu-decoration
		this.mc.addState("kontakt", new State( "kontakt", kontaktState ));


	};

	VController.prototype._detectBrowser = function() {
		// browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        this._browser = browser;
	};



	// public --------------------------------------------------------------------------------------------------------

	VController.prototype.clickHandler = function( index ) {
		if ( index == "home" ) {
			this.mc.gotoState( "home" );
			index = -1;
		} else {
			this.mc.gotoState( this._menuItems[ index ]);
		}

		this._manageContent( index );
	};



	

	return VController;
})(window, document);