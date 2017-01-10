var Content = function(a, b, c) {
    function d(a, b, c, d) {
        this.getMarkUp = a, this.activate = b, this.deactivate = c, this.callback = d;
    }
    return d;
}(window, document), ContentController = function(a, b, c) {
    function d(a) {
        this._$targetContainer = a, this._content = [], this._currentMarkUp = "", this._currentContentName = "";
    }
    return d.prototype._animateIn = function(a, b) {
        a = a || 700, this._$targetContainer.fadeIn(a, b);
    }, d.prototype._animateOut = function(a, b) {
        a = a || 700, this._$targetContainer.fadeOut(a, b);
    }, d.prototype.getCurrentContentName = function() {
        return this._currentContentName;
    }, d.prototype.addContent = function(a, b) {
        b instanceof Content ? this._content[a] = b : console.log(a + " is not member of class Content");
    }, d.prototype.removeContent = function(a) {
        this._content[a] !== c && delete _this.content[a];
    }, d.prototype.changeContent = function(a) {
        var b = this;
        return this._content[a] === c ? void console.log("ContentController: unknown content '" + a + "'") : this._currentContentName === a ? void console.log("Content already present") : (this._content[this._currentContentName] !== c && this._content[this._currentContentName].deactivate(), 
        void this._animateOut(700, function() {
            b._currentMarkUp = b._content[a].getMarkUp(), b._$targetContainer.empty().html(b._currentMarkUp), 
            b._currentContentName = a, b._content[b._currentContentName].activate(), b._animateIn(), 
            setTimeout(b._content[b._currentContentName].callback, 900);
        }));
    }, d;
}(window, document), GalleryClass = function() {
    function a(a) {
        this._images = [], this._imageFilenames = [], this._sources = a, this._isMouseDown = !1, 
        this._draggedObject = {
            x: 0,
            y: 0,
            domElement: {}
        }, this.lastT = 0, this.oldLeftPos = 0, this.selectedImageTimer = 0, this.selectedImageThreshold = 250;
    }
    return a.prototype._makeHTML = function() {
        var a = this, b = document.createElement("div");
        b.className = "gallery", a._images.forEach(function(a) {
            $(b).append(a.getThumb());
        }), a.html = b;
    }, a.prototype._getSourceNames = function() {
        var a = this;
        $.ajax({
            dataType: "json",
            url: a._sources,
            success: function(b) {
                $.each(b, function(b, c) {
                    a._imageFilenames.push(c), a.addImage(c.thumb, c.big);
                }), a._makeHTML();
            }
        });
    }, a.prototype.addImage = function(a, b) {
        var c = this, d = c._images.length + 1;
        c._images.push(new Thumbnail("images/" + a, "images/" + b, "thumb_" + d, "big_" + d));
    }, a.prototype.init = function() {
        var a = this;
        a._getSourceNames();
    }, a.prototype.activate = function() {}, a.prototype.deactivate = function() {}, 
    a.prototype.callback = function() {}, a.prototype.getMarkUp = function() {
        return $(this.html).html();
    }, a;
}(), Home = {
    getMarkUp: function() {
        var a = $("<div class='home-circle'><img src='images/portrait_1.jpg'></div>");
        return a;
    },
    activate: function() {},
    deactivate: function() {}
}, Kontakt = {
    getMarkUp: function() {
        var a = "<div class='kontakt-wrapper'>";
        return a += $(".kontakt").html(), a += "</div>";
    },
    activate: function() {
        var a = Kontakt, b = parseInt($(".menu-item").eq(4).css("top"), 10), c = $(".menu-item")[4].getBoundingClientRect().height;
        $(".kontakt-schablone").css({
            height: c + 20 + "px",
            top: 1.08 * b - 10 + "px",
            display: "none"
        }), $(".kontakt-schablone").fadeIn(0), $(".impressum-link")[0].addEventListener("click", a.showImpressum), 
        a.closeIcon = new Image(), a.closeIcon.src = "icons_e/close_24px.svg", a.closeIcon.className = "close-icon", 
        window.innerHeight < 700 && $(".kontakt-text").css("font-size", "85%");
    },
    deactivate: function() {},
    callback: function() {},
    showImpressum: function() {
        var a = Kontakt, b = $("<div class = 'impressum-overlay'></div>");
        b.append(a.closeIcon);
        var c = $("<div class='impressum'></div>");
        window.innerHeight < 725 && c.css("font-size", "85%"), window.innerHeight < 700 && c.css("font-size", "75%"), 
        c.append($(".impressum-text").html()), b.append(c), $("body").append(b), $(".close-icon")[0].addEventListener("click", function() {
            $(".impressum-overlay").remove();
        });
    }
}, MenuController = function(a, b, c) {
    function d(a, b) {
        var c = this;
        this._menuStates = new MenuStates(), this._items = [], this._currentState = "", 
        this._propertiesAnimated = 0, a.each(function(a, d) {
            c._items.push(new Item($(d), 0, 0, 0, 0, 0, 1, b));
        }), this._isMenuAnimating = !1, events.on("stateChanges", function() {
            c._isMenuAnimating = !0;
        }), events.on("stateChanged", function() {});
    }
    return d.prototype.render = function() {
        var a = this, b = this._currentState;
        a._items.forEach(function(a, c) {
            a.render(b.x[c], b.y[c], b.width[c], b.height[c], b.fontSize[c], b.opacity[c]);
        });
    }, d.prototype._propertiesAnimationHandler = function() {
        var a = this;
        a._propertiesAnimated--, a._propertiesAnimated <= 0 && (events.emit("stateChanged"), 
        setTimeout(function() {
            a._isMenuAnimating = !1, a._propertiesAnimated = 0;
        }, 250));
    }, d.prototype.addState = function(a, b) {
        var d = this;
        console.log(a + ": " + d._menuStates.getState(a)), d._menuStates.getState(a) !== c ? (d._currentState.getName().trim() == a.trim() && (d._currentState = b), 
        d._menuStates.removeState(a), d._menuStates.addState(a, b)) : d._menuStates.addState(a, b);
    }, d.prototype.removeState = function(a) {
        this._menuStates.removeState(a);
    }, d.prototype.getCurrentStateName = function() {
        return "" !== this._currentState ? this._currentState.getName() : void 0;
    }, d.prototype.gotoState = function(a) {
        var b = this, d = b._menuStates.getState(a);
        return d === c ? void console.log("MenuController: State '" + a + "' doesn't exist.") : d == b._currentState ? void (b._isMenuAnimating = !1) : (events.emit("stateChanges"), 
        b._items.forEach(function(a, c) {
            b._propertiesAnimated += 5, a.move(d.x[c], d.y[c], b._propertiesAnimationHandler.bind(b)), 
            a.stretch(d.width[c], b._propertiesAnimationHandler.bind(b)), a.changeHeight(d.height[c], b._propertiesAnimationHandler.bind(b)), 
            a.changeFontSize(d.fontSize[c], b._propertiesAnimationHandler.bind(b)), a.changeOpacity(d.opacity[c], b._propertiesAnimationHandler.bind(b));
        }), void (this._currentState = d));
    }, d;
}(window, document), Thumbnail = function() {
    function a(a, b, c, d) {
        this.sourceThumb = a, this.sourceBig = b, this.thumbClass = c, this.bigClass = d, 
        this.thumb_img = void 0, this.big_img = void 0, this._loadThumb();
    }
    return a.prototype._loadThumb = function() {
        var a = this;
        a.thumb_img = new Image(), a.thumb_img.src = a.sourceThumb, a.thumb_img["class"] = a.thumbClass;
    }, a.prototype._loadBig = function() {
        var a = this;
        a.big_img = new Image(), a.big_img.src = a.sourceBig, a.big_img["class"] = a.bigClass;
    }, a.prototype.getIndex = function() {
        return parseInt(this.thumbClass.slice(5, -1), 10);
    }, a.prototype.getThumb = function() {
        return this.thumb_img;
    }, a.prototype.getBig = function() {
        return this.big_img;
    }, a.prototype.getWidth = function() {
        return this.thumb_img.width;
    }, a.prototype.setBigClass = function(a) {
        this.bigClass = a;
    }, a;
}(), VController = function(a, b, c) {
    function d() {
        this._menuItems = [ "agenda", "vita", "hören", "sehen", "kontakt" ], this._init(), 
        this.mc.gotoState("home"), this._manageContent(-1);
    }
    return d.prototype._init = function() {
        var a = this;
        this._detectBrowser();
        var b = $(".menu-item");
        b.push($(".home-button")), b.push($(".play-button")), b.push($(".menu-name")), b.push($(".menu-sopran")), 
        a.cc = new ContentController($(".content")), this.mc = new MenuController(b, this._browser), 
        AudioPlayer.init(), b.find("text").each(function() {
            $(this) !== c && ($(this)[0].setAttribute("textLength", 1), $(this)[0].setAttribute("y", 0));
        }), Agenda.init(), Gallery.init(), a.cc.addContent("agenda", new Content(Agenda.getMarkUp.bind(Agenda), Agenda.activate.bind(Agenda), Agenda.deactivate.bind(Agenda), Agenda.callback.bind(Agenda))), 
        a.cc.addContent("vita", new Content(Vita.getMarkUp.bind(Vita), Vita.activate.bind(Vita), Vita.deactivate.bind(Vita), Vita.callback.bind(Vita))), 
        a.cc.addContent("hören", new Content(AudioPlayer.getMarkUp.bind(AudioPlayer), AudioPlayer.activate.bind(AudioPlayer), AudioPlayer.deactivate.bind(AudioPlayer), AudioPlayer.callback.bind(AudioPlayer))), 
        a.cc.addContent("sehen", new Content(Gallery.getMarkUp.bind(Gallery), Gallery.activate.bind(Gallery), Gallery.deactivate.bind(Gallery), Gallery.callback.bind(Gallery))), 
        a.cc.addContent("kontakt", new Content(Kontakt.getMarkUp.bind(Kontakt), Kontakt.activate.bind(Kontakt), Kontakt.deactivate.bind(Kontakt), Kontakt.callback.bind(Kontakt))), 
        a.cc.addContent("home", new Content(Home.getMarkUp, Home.activate, Home.deactivate)), 
        events.on("resize", function() {
            a._calculatePositions(), a.mc.render();
        }), this._calculatePositions();
    }, d.prototype._manageContent = function(a) {
        this.cc.getCurrentContentName();
        -1 == a ? newContentName = "home" : newContentName = this._menuItems[a], this.cc.changeContent(newContentName);
    }, d.prototype._calculatePositions = function() {
        var b = parseInt(a.innerWidth, 10) / parseInt(a.innerHeight, 10), c = .21 * a.innerHeight, d = .09 * a.innerHeight, e = .4 * a.innerWidth, f = .29 * a.innerWidth;
        f = f > 300 ? 300 : f;
        var g = 10, h = 10, i = .0062 * a.innerHeight, j = i / 5.5, k = 10, l = 0, b = a.innerWidth / a.innerHeight;
        b > 15 / 9 && (l = 30);
        for (var m = [], n = 0; 5 > n; n++) {
            var o = [ 372 * j, 210 * j, 318 * j, 304 * j, 395 * j ][n];
            m.push({
                x: e,
                y: c + n * d,
                width: o,
                height: d,
                fontSize: i,
                opacity: .1
            });
        }
        m.push({
            x: g,
            y: h,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), m.push({
            x: -130,
            y: c + 2.65 * d,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), m.push({
            x: e - 130,
            y: c - 10,
            width: 310,
            height: 10 * i,
            fontSize: i / 2.2,
            opacity: 1
        }), m.push({
            x: e - 130,
            y: c + .5 * d - 10,
            width: 130,
            height: 10 * i,
            fontSize: i / 2.2,
            opacity: 1
        }), this.mc.addState("home", new State("home", m));
        var p = [];
        this.mc.removeState("agenda"), p.push({
            x: k + 40,
            y: c,
            width: 372 * j,
            height: d,
            fontSize: i - .5,
            opacity: 1
        });
        for (var n = 1; 5 > n; n++) p.push({
            x: k,
            y: c + n * d,
            width: f,
            height: d,
            fontSize: i - 2,
            opacity: .5
        });
        p.push({
            x: g,
            y: h,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), p.push({
            x: -130,
            y: c + 2.65 * d,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), p.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), p.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("agenda", new State("agenda", p));
        var q = [];
        this.mc.removeState("vita");
        for (var n = 0; 5 > n; n++) 1 == n ? q.push({
            x: .3 * a.innerWidth,
            y: c + n * d,
            width: 230 * j,
            height: d,
            fontSize: i - .5,
            opacity: 1
        }) : q.push({
            x: k,
            y: c + n * d,
            width: f,
            height: d,
            fontSize: i - 2,
            opacity: .5
        });
        q.push({
            x: g,
            y: h,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), q.push({
            x: -130,
            y: c + 2.65 * d,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), q.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), q.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("vita", new State("vita", q));
        var r = [];
        this.mc.removeState("hören");
        for (var n = 0; 5 > n; n++) 2 == n ? r.push({
            x: k + 64,
            y: c + n * d,
            width: 318 * j,
            height: d,
            fontSize: i - .5,
            opacity: 1
        }) : r.push({
            x: k,
            y: c + n * d,
            width: f,
            height: d,
            fontSize: i - 2,
            opacity: .5
        });
        r.push({
            x: g,
            y: h,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), r.push({
            x: 5,
            y: c + 2.65 * d,
            width: a.innerHeight / 14,
            height: a.innerHeight / 14,
            fontSize: 0,
            opacity: 1
        }), r.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), r.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("hören", new State("hören", r));
        var s = [];
        this.mc.removeState("sehen");
        for (var n = 0; 5 > n; n++) 3 == n ? s.push({
            x: .25 * a.innerWidth,
            y: c + n * d,
            width: 304 * j,
            height: d,
            fontSize: i - .5,
            opacity: 1
        }) : s.push({
            x: k,
            y: c + n * d,
            width: f,
            height: d,
            fontSize: i - 2,
            opacity: .5
        });
        s.push({
            x: g,
            y: h,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), s.push({
            x: -130,
            y: c + 2.65 * d,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), s.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), s.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("sehen", new State("sehen", s));
        for (var t = [], n = 0; 5 > n; n++) 4 == n ? t.push({
            x: .25 * a.innerWidth,
            y: c + n * d,
            width: 395 * j,
            height: d,
            fontSize: i - .5,
            opacity: 1
        }) : t.push({
            x: k,
            y: c + n * d,
            width: f,
            height: d,
            fontSize: i - 2,
            opacity: .5
        });
        t.push({
            x: g,
            y: h,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), t.push({
            x: -130,
            y: c + 2.65 * d,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), t.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), t.push({
            x: e - 50,
            y: c - 30,
            width: 128,
            height: 10 * i,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("kontakt", new State("kontakt", t));
    }, d.prototype._detectBrowser = function() {
        var a, b, c, d = (navigator.appVersion, navigator.userAgent), e = navigator.appName, f = "" + parseFloat(navigator.appVersion), g = parseInt(navigator.appVersion, 10);
        -1 != (b = d.indexOf("Opera")) && (e = "Opera", f = d.substring(b + 6), -1 != (b = d.indexOf("Version")) && (f = d.substring(b + 8))), 
        -1 != (b = d.indexOf("OPR")) ? (e = "Opera", f = d.substring(b + 4)) : -1 != (b = d.indexOf("MSIE")) ? (e = "Microsoft Internet Explorer", 
        f = d.substring(b + 5)) : -1 != (b = d.indexOf("Chrome")) ? (e = "Chrome", f = d.substring(b + 7)) : -1 != (b = d.indexOf("Safari")) ? (e = "Safari", 
        f = d.substring(b + 7), -1 != (b = d.indexOf("Version")) && (f = d.substring(b + 8))) : -1 != (b = d.indexOf("Firefox")) ? (e = "Firefox", 
        f = d.substring(b + 8)) : -1 != d.indexOf("Trident/") ? (e = "Microsoft Internet Explorer", 
        f = d.substring(d.indexOf("rv:") + 3)) : (a = d.lastIndexOf(" ") + 1) < (b = d.lastIndexOf("/")) && (e = d.substring(a, b), 
        f = d.substring(b + 1), e.toLowerCase() == e.toUpperCase() && (e = navigator.appName)), 
        -1 != (c = f.indexOf(";")) && (f = f.substring(0, c)), -1 != (c = f.indexOf(" ")) && (f = f.substring(0, c)), 
        -1 != (c = f.indexOf(")")) && (f = f.substring(0, c)), g = parseInt("" + f, 10), 
        isNaN(g) && (f = "" + parseFloat(navigator.appVersion), g = parseInt(navigator.appVersion, 10)), 
        this._browser = e;
    }, d.prototype.clickHandler = function(a) {
        this.mc._isMenuAnimating ? console.log("Click blocked") : ("home" == a ? (this.mc.gotoState("home"), 
        a = -1) : this.mc.gotoState(this._menuItems[a]), this._manageContent(a));
    }, d;
}(window, document), Vita = {
    getMarkUp: function() {
        var a = "<div class='vita-wrapper'>";
        return a += $(".vita").html(), a += "</div>";
    },
    activate: function() {
    },
    deactivate: function() {},
    callback: function() {
        var a = Vita, b = $(".vita-image>img")[0].getBoundingClientRect(), c = parseInt(b.width, 10) + parseInt(b.left, 10);
        c > window.innerWidth ? window.innerWidth : c;
        a.scrollHeight = parseInt($(".vita-scroll-div").css("height"), 10), a._maxScrollHeight = window.getComputedStyle($(".vita-text")[0], null).height, 
        a._maxScrollHeight = parseInt(a._maxScrollHeight, 10) - .5 * window.innerHeight;
        var d = $(".vita-text")[0].getBoundingClientRect();
        d.bottom > window.innerHeight && (a.activateNavigation(), $(".content").mousewheel(a.mouseScrollHandler), 
        $(".vita-scroll-div").removeClass("hide"));
    },
    activateNavigation: function() {
        var a = Vita;
        $(".vita-scroll-div")[0].addEventListener("mousedown", Vita.mouseDownHandler, !1), 
        document.body.addEventListener("mouseup", Vita.mouseUpHandler, !1), document.body.addEventListener("mousemove", Vita.mouseMoveHandler, !1), 
        a.navMenuItem = $(".vita-kloetzchen")[0];
    },
    deactivateNavigation: function() {
        var a = Vita;
        $(".vita-text")[0], removeEventListener("mousedown", a.mouseDownHandler), document.body.removeEventListener("mouseup", a.mouseUpHandler), 
        document.body.removeEventListener("mouesemove", a.mosueMoveHandler);
    },
    mouseDownHandler: function(a) {
        var b = Vita, c = $(".vita-scroll-div")[0].getBoundingClientRect(), d = c.top, e = parseInt($(b.navMenuItem).css("top"), 10), f = a.pageY - d;
        if (console.log(b._maxScrollHeight), b.oldNavItemPos = parseInt(e, 10), b.startY = a.pageY, 
        b.isMouseDown = !0, e > f || f > e) {
            $(".vita-kloetzchen").css({
                top: f - 24
            }), b.oldNavItemPos = f - 24;
            var g = f / (b.scrollHeight - 48);
            $(".vita-txt").css("top", -g * b._maxScrollHeight), console.log(-g * b._maxScrollHeight);
        }
    },
    mouseUpHandler: function(a) {
        var b = Vita;
        b.isMouseDown = !1;
    },
    mouseMoveHandler: function(a) {
        var b = Vita;
        if (b.isMouseDown) {
            var c = b.oldNavItemPos + (a.pageY - b.startY);
            c = 0 > c ? 0 : c, c = c > b.scrollHeight - 48 ? b.scrollHeight - 48 : c, $(b.navMenuItem).css("top", c + "px");
            var d = c / (b.scrollHeight - 48);
            $(".vita-text").css("top", -d * b._maxScrollHeight);
        }
    },
    mouseScrollHandler: function(a) {
        var b = Vita, c = parseInt($(".vita-kloetzchen").css("top"), 10) - 12 * a.deltaY;
        c = 0 > c ? 0 : c, c = c > b.scrollHeight - 48 ? b.scrollHeight - 48 : c, $(b.navMenuItem).css("top", c + "px");
        var d = c / (b.scrollHeight - 48);
        $(".vita-text").css("top", -d * b._maxScrollHeight), b.oldNavItemPos = c;
    }
}, Agenda = {
    container: {
        css: {
            position: "absolute",
            left: "0",
            top: "80px",
            width: "1000%",
            height: "220px",
            overflow: "hidden"
        },
        timeLine: []
    },
    markUp: "",
    numberOfEventboxes: 0,
    upcomingEvent: 0,
    deceleration: .9,
    isMouseDown: !1,
    isTouch: !1,
    draggedObject: {
        domElement: {},
        x: 0,
        y: 0
    },
    leftPos: 0,
    oldLeftPos: 0,
    scrollSpeed: 0,
    lastT: 0,
    deltaT: 0,
    scrolling: !1,
    scrollHandler: function() {},
    init: function() {
        var a = Agenda, b = document.createElement("div");
        b.className = "agenda invisible", $.ajax({
            url: "include/db_events.php",
            type: "POST",
            dataType: "json",
            async: !1,
            success: function(b) {
                today = new Date(), console.log(today);
                var c = "<div class='agenda'>";
                $.each(b, function(a, b) {
                    var d = "";
                    if (Agenda.numberOfEventboxes++, b.besetzung = $.parseJSON(b.besetzung), datum = new Date(b.datum), 
                    datum < today && (Agenda.upcomingEvent = a), 0 == datum.getHours()) var e = {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }; else var e = {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    };
                    b.datum = datum.toLocaleDateString("de-De", e).replace(":", "h"), $.each(b.besetzung, function(a, b) {
                        d += "-" != a.substring(0, 1) ? "<div class='zeile'><span class='rolle'>" + a + ":</span><span class='darsteller'>" + b + "</span></div>" : "<div class='zeile'><div class = 'one-line'>" + b + "</div></div>";
                    }), c += '<div class="event">\n							<div class="event-up">\n								<div class="komponist">' + b.komponist + '</div>\n								<div class="title">' + b.title + '</div>\n								<div class="ort">' + b.ort + '</div>\n							</div> \n							<div class="event-date">\n								<div class="datum">' + b.datum + "</div>\n							</div>", 
                    void 0 !== b.image ? (c += '<div class="card flippable"><div class="event-low flipped"><div class="besetzung">' + d + "</div></div>", 
                    c += ' <div class="event-image"> <img src ="' + b.image + '"/> </div></div>') : c += '<div class="card"><div class="event-low"><div class="besetzung">' + d + "</div></div></div>", 
                    c += "</div>";
                }), c += "</div>", c += "<div class='scroll-div-wrapper'><div class='scroll-div'><div class='kloetzchen'></div><div class='strich'></div></div></div>", 
                a.html = c;
            }
        });
    },
    getMarkUp: function() {
        return Agenda.html;
    },
    activate: function() {
        var a = Agenda;
        a.navMenuItem = $(".kloetzchen")[0], a.activateNavigation(), $(".scroll-div-wrapper").toggleClass("hide");
    },
    deactivate: function() {
        Agenda.deactivateNavigation();
    },
    callback: function() {
        var a = this;
        window.innerHeight < 750 && $(".scroll-div-wrapper").css("bottom", "0"), window.innerHeight < 700 && $(".event").css({
            "font-size": "80%",
            height: ""
        }), $(".scroll-div-wrapper").toggleClass("hide"), a.eventBoxWidth = $(".event")[0].getBoundingClientRect().width + 1, 
        a.timelineLength = Agenda.numberOfEventboxes * (a.eventBoxWidth + 28), $(".agenda").css("width", a.timelineLength + "px"), 
        $("body").mousewheel(a.mouseScrollHandler), $(".flippable").click(function() {
            $("div", this).toggleClass("flipped");
        }), a.scrollWidth = parseInt($(".scroll-div").css("width"), 10), a._maxScrollWidth = window.getComputedStyle($(".agenda")[0], null).width, 
        a._maxScrollWidth = parseInt(a._maxScrollWidth, 10) - .7 * window.innerWidth;
        var b = $(".event").eq(Agenda.upcomingEvent + 1).position().left;
        console.log(b);
        var c = (b - .28 * window.innerWidth) * (a.scrollWidth - 32) / a._maxScrollWidth;
        $(a.navMenuItem).animate({
            left: c + "px"
        }, 700), a.scrollAgendaAccordingScrollIcon(c);
    },
    activateNavigation: function() {
        $(".scroll-div")[0].addEventListener("mousedown", Agenda.mouseDownHandler, !1), 
        document.body.addEventListener("mouseup", Agenda.mouseUpHandler, !1), document.body.addEventListener("mousemove", Agenda.mouseMoveHandler, !1), 
        $(document).on("touchstart", ".agenda", Agenda.touchStartHandler), $(document).on("touchend", "body", Agenda.touchEndHandler), 
        $(document).on("touchmove", "body", Agenda.touchMoveHandler);
    },
    deactivateNavigation: function() {
        var a = Agenda;
        $(".agenda")[0], removeEventListener("mousedown", a.mouseDownHandler), document.body.removeEventListener("mouseup", a.mouseUpHandler), 
        document.body.removeEventListener("mouesemove", a.mosueMoveHandler), $("body").off();
    },
    animateTimeline: function() {
        var a = Agenda;
        $(".agenda").css("left", a.leftPos + "px");
    },
    mouseDownHandler: function(a) {
        var b = Agenda, c = $(".scroll-div")[0].getBoundingClientRect(), d = c.left, e = parseInt($(b.navMenuItem).css("left"), 10), f = a.pageX - d;
        if (f = 24 > f ? 24 : f, b.oldNavItemPos = parseInt(e, 10), b.startX = a.pageX, 
        b.isMouseDown = !0, e > f || f > e) {
            $(b.navMenuItem).css({
                left: f - 24
            }), b.oldNavItemPos = f - 24;
            var g = f / (b.scrollWidth - 48);
            $(".agenda").css("left", -g * b._maxScrollWidth + .3 * window.innerWidth);
        }
    },
    mouseUpHandler: function(a) {
        var b = Agenda;
        b.isMouseDown = !1;
    },
    mouseMoveHandler: function(a) {
        var b = Agenda;
        if (b.isMouseDown) {
            var c = b.oldNavItemPos + (a.pageX - b.startX);
            c = 0 > c ? 0 : c, c = c > b.scrollWidth - 32 ? b.scrollWidth - 32 : c, $(b.navMenuItem).css("left", c + "px"), 
            b.scrollAgendaAccordingScrollIcon();
        }
    },
    mouseScrollHandler: function(a) {
        var b = Agenda, c = parseInt($(".kloetzchen").css("left"), 10) + 8 * a.deltaY;
        c = 0 > c ? 0 : c, c = c > b.scrollWidth - 32 ? b.scrollWidth - 32 : c, $(b.navMenuItem).css("left", c + "px");
        var d = c / (b.scrollWidth - 32);
        $(".agenda").stop().animate({
            left: -d * b._maxScrollWidth + .28 * window.innerWidth
        }, 100), b.oldNavItemPos = c;
    },
    touchStartHandler: function(a) {
        console.log(a.originalEvent.touches[0].pageX);
        var b = Agenda, c = $(".scroll-div")[0].getBoundingClientRect(), d = c.left;
        parseInt($(b.navMenuItem).css("left"), 10);
        b.startX = a.originalEvent.touches[0].pageX;
        var e = b.startX - d;
        e = 24 > e ? 24 : e, b.oldAgendaLeft = parseInt($(".agenda").css("left"), 10), b.isTouch = !0;
    },
    touchEndHandler: function() {
        var a = Agenda;
        a.isTouch = !1;
    },
    touchMoveHandler: function(a) {
        if (Agenda.isTouch) {
            var b = Agenda, c = a.originalEvent.touches[0].pageX - b.startX, d = b.oldAgendaLeft + c;
            d = d > .28 * window.innerWidth ? .28 * window.innerWidth : d, d = d < -b._maxScrollWidth - b.eventBoxWidth + .6 * window.innerWidth ? -b._maxScrollWidth - b.eventBoxWidth + .6 * window.innerWidth : d, 
            $(".agenda").css("left", d + "px");
            var e = (.3 * window.innerWidth - d) * (b.scrollWidth - 32) / b._maxScrollWidth;
            $(".kloetzchen").css("left", e);
        }
    },
    scrollAgendaAccordingScrollIcon: function(a) {
        var b = this, c = a || $(b.navMenuItem).css("left");
        console.log(a + " .. " + c);
        var d = c / (b.scrollWidth - 32);
        $(".agenda").animate({
            left: -d * b._maxScrollWidth + .28 * window.innerWidth
        }, 700);
    }
}, AudioPlayer = {
    _html: "",
    audioMenuItem: {},
    audioMenuItemWidth: 0,
    pauseIcon: {},
    playIcon: {},
    isAudioPlaying: !1,
    trackNumberPlaying: -1,
    currentTrackDiv: {},
    timeUpdateHandler: {},
    navigationUpdateHandler: {},
    isMouseDown: !1,
    startX: 0,
    oldItemPos: 0,
    navPerc: 0,
    windowWidth: 0,
    audioSources: [ {
        komponist: "Giovanni Battista Pergolesi",
        titel: "Salve Regina",
        src: "audio/Salve_Regina.mp3"
    }, {
        komponist: "Martino Pesenti",
        titel: "Filli, Filli, non t'amo più",
        src: "audio/Filli_Filli.mp3"
    }, {
        komponist: "GIOVANNI ANTONIO RIGATTI",
        titel: "O dolcezza incredibile d´amore",
        src: "audio/O_dolcezza_incredibile.mp3"
    }, {
        komponist: "Wolfgang Heiniger",
        titel: "Lapislazuli",
        src: "audio/Lapislazuli.mp3"
    }, {
        komponist: "ERNEST CHAUSSON",
        titel: "Sérénade",
        src: "audio/Chausson_Serenade.mp3"
    } ],
    audioDescriptions: [ {
        ort: "Dom zu Maria Saal, Kärnten",
        jahr: "2013",
        beschreibung: "Livemitschnitt<br>Meine Seele preist den Herrn",
        besetzung: [ "Roswitha Dokalik - Violine Leitung" ],
        disclaimer: "mit freundlicher Genehmigung von Stefan Schweiger"
    }, {
        ort: "Rathaussaal St. Veit, Kärnten",
        jahr: "2013",
        beschreibung: "Livemitschnitt<br>L´inatteso paesaggio della seconda prattica",
        besetzung: [ "Franco Pavan - Theorbe, Leitung", "Trigonale 2013" ],
        disclaimer: "mit freundlicher Genehmigung von Stefan&nbsp;Schweiger"
    }, {
        ort: "Rathaussaal St. Veit, Kärnten",
        jahr: "2013",
        beschreibung: "Livemitschnitt<br>L´inatteso paesaggio della seconda prattica",
        besetzung: [ "Franco Pavan - Theorbe, Leitung", "Ida Aldrian - Mezzosopran", "Trigonale 2013" ],
        disclaimer: "mit freundlicher Genehmigung von Stefan&nbsp;Schweiger"
    }, {
        ort: "Berlin",
        jahr: "2015",
        besetzung: [ "<br>Oboe - Christoph Hartmann", "Sopran - Hanna Herfurtner", "Elektronik - Wolfgang Heiniger" ]
    }, {
        ort: "Tokio",
        jahr: "2012",
        beschreibung: 'Livemitschnitt<br>"The Art of Coloratura"<br>Musashino Cultural Hall',
        besetzung: [ "Masahiro Saitoh - Klavier" ]
    } ],
    audioElements: [],
    audioElementsLoaded: 0,
    init: function() {
        var a = AudioPlayer;
        a.pauseIcon.src || (a.pauseIcon = new Image(), a.playIcon = new Image(), a.pauseIcon.src = "icons_e/pause-icon.svg", 
        a.playIcon.src = "icons_e/play-icon.svg", a.playIcon.className = "play-button-img", 
        a.pauseIcon.className = "play-button-img", a.audioSources.forEach(function(b, c) {
            a.audioElements[c] = new Audio(), a.audioElements[c].src = b.src, a.audioElements[c].titel = b.titel, 
            a.audioElements[c].komponist = b.komponist.toUpperCase(), a.audioElements[c].addEventListener("canplaythrough", a.audioReady, !1);
        })), $(".play-button").empty().append(a.playIcon);
        var b = "<div class='audio-image'><img src='images/hoeren.jpg' /></div><div class = 'audio'>", c = "";
        a.audioElements.forEach(function(a) {
            c += "<div class='audio-track'><div class='audio-komponist'>" + a.komponist + "</div><div class='audio-titel'>" + a.titel + "</div></div>";
        }), b += c, b += "</div>", a._html = b, a.isAudioPlaying = !1, a.trackNumberPlaying = -1, 
        a.isMouseDown = !1;
    },
    activate: function() {
        var a = AudioPlayer;
        a.audioMenuItem = $(".menu-item")[2];
        var b = $(a.audioMenuItem).css("width");
        a.audioMenuItemWidth = parseInt(b.substring(0, b.length - 2));
        var c = $(a.audioMenuItem).css("height");
        a.audioMenuItemHeight = parseInt(c.substring(0, c.length - 2)), a._onClickFunctionOfMenuItem = $._data(a.audioMenuItem, "events").click.handler, 
        $(a.audioMenuItem).off(), a.windowWidth = window.innerWidth - a.audioMenuItemWidth + 80, 
        $(".play-button").on("click", function() {
            setTimeout(a.playButtonClickHandler, 100);
        }), $(".audio").children().each(function(b, c) {
            c.addEventListener("click", a.audioClicked, !1);
        });
    },
    callback: function() {
        var a = this;
        a._itemStartPos = parseInt($(a.audioMenuItem).css("left")), console.log("Item Startpos: " + a._itemStartPos);
    },
    deactivate: function() {
        AudioPlayer.stopCurrentPlaying(), AudioPlayer.clearAudioNavigation(), $(".menu-item").eq(2).on("click", function() {
            events.emit("itemClicked", $(this).index());
        }), $(".nav-audio").removeClass("nav-audio"), $(".play-button").off(), self.isMouseDown = !1;
    },
    getMarkUp: function() {
        return this._html;
    },
    playButtonClickHandler: function() {
        var a = AudioPlayer;
        a.isMouseDown = !1, a.isAudioPlaying ? a.stopCurrentPlaying() : (a.pauseIcon.style.width = a.playIcon.width + "px", 
        $(".play-button").empty().append(a.pauseIcon), -1 == a.trackNumberPlaying ? a.playTrack(0) : a.playTrack(a.trackNumberPlaying));
    },
    stopCurrentPlaying: function() {
        var a = AudioPlayer;
        a.isAudioPlaying && (clearInterval(a.timeUpdateHandler), a.audioElements[a.trackNumberPlaying].pause(), 
        a.isAudioPlaying = !1, $(".play-button").empty().append(a.playIcon));
    },
    playNextTrack: function() {
        var a, b = AudioPlayer;
        a = b.isAudioPlaying ? b.trackNumberPlaying + 1 == b.audioElements.length ? 0 : b.trackNumberPlaying + 1 : 0, 
        0 == a ? b.stopCurrentPlaying() : b.playTrack(a);
    },
    clearAudioNavigation: function() {
        var a = AudioPlayer;
        $(a.audioMenuItem).off("mousedown"), document.body.removeEventListener("mouseup", a.mouseUpHandler), 
        document.body.removeEventListener("mousemove", a.mouseMoveHandler), clearInterval(AudioPlayer.navigationUpdateHandler), 
        clearInterval(a.timeUpdateHandler), a.isMouseDown = !1, a.startX = 0, a.oldItemPos = 0, 
        a.navPerc = 0;
    },
    playTrack: function(a) {
        var b = AudioPlayer;
        return b.isMouseDown = !1, $(b.audioMenuItem).stop(), b.trackNumberPlaying == a && b.isAudioPlaying ? void b.stopCurrentPlaying() : (b.isAudioPlaying && b.stopCurrentPlaying(), 
        $(b.audioMenuItem).addClass("nav-audio"), b.isAudioPlaying = !0, b.currentTrackDiv = $(".audio-track").eq(a), 
        a != b.trackNumberPlaying && (b.audioElements[a].currentTime = 0), b.trackNumberPlaying = a, 
        b.pauseIcon.style.width !== b.playIcon.style.width && (b.pauseIcon.style.width = b.playIcon.width + "px"), 
        $(".play-button").empty().append(b.pauseIcon), $(".selected").removeClass("selected"), 
        b.currentTrackDiv.addClass("selected"), clearInterval(b.timeUpdateHandler), clearInterval(b.navigationUpdateHandler), 
        b.timeUpdateHandler = setInterval(b.timeUpdate, 1e3), b.navigationUpdateHandler = setInterval(b.navigationUpdate, 30), 
        b.audioElements[a].play(), b.createTime(), b.createInfoBox(), b.initAudioNavigation(), 
        void b.timeUpdate());
    },
    audioClicked: function() {
        var a = AudioPlayer;
        a.clearAudioNavigation();
        var b = $(this).index();
        a.currentTrackDiv = $(this), a.playTrack(b);
    },
    initAudioNavigation: function() {
        var a = AudioPlayer, b = (a.audioElements[a.trackNumberPlaying], a.audioMenuItem);
        b.addEventListener("mousedown", a.mouseDownHandler, !1), document.body.addEventListener("mouseup", a.mouseUpHandler, !1), 
        document.body.addEventListener("mousemove", a.mouseMoveHandler, !1);
    },
    mouseDownHandler: function(a) {
        var b = AudioPlayer;
        b.isMouseDown = !0, b.startX = a.pageX;
        var c = $(b.audioMenuItem).css("left");
        b.oldItemPos = parseInt(c.substring(0, c.length - 2)), b.audioElements[b.trackNumberPlaying].pause(), 
        clearInterval(b.navigationUpdateHandler), clearInterval(b.timeUpdateHandler);
    },
    mouseUpHandler: function() {
        var a = AudioPlayer;
        if (console.log("AudioUp"), a.isMouseDown) {
            a.isMouseDown = !1;
            var b = a.audioElements[a.trackNumberPlaying];
            b.currentTime = a.navPerc * b.duration / 100, a.isAudioPlaying && b.play(), clearInterval(a.navigationUpdateHandler), 
            clearInterval(a.timeUpdateHandler), a.timeUpdateHandler = setInterval(a.timeUpdate, 1e3), 
            a.navigationUpdateHandler = setInterval(a.navigationUpdate, 30);
        }
    },
    mouseMoveHandler: function(a) {
        var b = AudioPlayer;
        if (b.isMouseDown) {
            var c = a.pageX - b.startX, d = b.oldItemPos + c, e = 100 * (d - b._itemStartPos) / (window.innerWidth - b.audioMenuItemWidth - 60);
            e = e > 100 ? 100 : e, e = 0 > e ? 0 : e, b.navPerc = e;
            var f = b.audioElements[b.trackNumberPlaying];
            f.currentTime = b.navPerc * f.duration / 100, b.navigationUpdate(), b.timeUpdate();
        }
    },
    navigationUpdate: function() {
        var a = AudioPlayer, b = a.audioElements[a.trackNumberPlaying], c = b.currentTime / b.duration;
        b.duration - b.currentTime < 1 && !a.isMouseDown && a.playNextTrack();
        var d = c * (window.innerWidth - a.audioMenuItemWidth - 60) + a._itemStartPos;
        $(a.audioMenuItem).css("left", d + "px");
    },
    timeUpdate: function() {
        var a = AudioPlayer, b = Math.floor(a.audioElements[a.trackNumberPlaying].duration), c = Math.floor(b / 60);
        b -= 60 * c;
        var d = Math.floor(a.audioElements[a.trackNumberPlaying].currentTime), e = Math.floor(d / 60);
        d -= 60 * e;
        var f = Math.floor(a.audioElements[a.trackNumberPlaying].duration - a.audioElements[a.trackNumberPlaying].currentTime), g = Math.floor(f / 60);
        f -= 60 * g, $(".time-box").text(a.formatTime(g, f));
    },
    formatTime: function(a, b) {
        var c = "";
        for (c += "" + a, b = "" + b; b.length < 2; ) b = "0" + b;
        return c += ":" + b;
    },
    createTime: function() {
        $(".time-box").remove();
        var a = document.createElement("div");
        a.className = "time-box", $(".content").append(a);
    },
    createInfoBox: function() {
        var a = AudioPlayer;
        $(".audio-info-box").remove();
        var b = a.audioDescriptions[a.trackNumberPlaying], c = document.createElement("div");
        c.className = "audio-info-box", $.each(b, function(a, b) {
            "besetzung" !== a ? c.innerHTML += "<div class='" + a + "'>" + b + "</div>" : $.each(b, function(a, b) {
                c.innerHTML += "<div class='besetzung'>" + b + "</div>";
            });
        }), a.currentTrackDiv.append(c);
        var d = a.currentTrackDiv[0].getBoundingClientRect(), e = d.top + 16, f = $(".audio-info-box").css("height"), g = parseInt(f.substring(0, f.length - 2)) + 40;
        window.innerHeight;
        parseInt(e + g) > window.innerHeight ? ($(".audio-info-box").css("bottom", window.innerHeight - e), 
        $(".time-box").css("top", e + 4 + "px")) : ($(".audio-info-box").css("top", e - .55 * window.innerHeight), 
        $(".time-box").css("top", e - 16 + "px"));
    },
    audioReady: function() {
        var a = AudioPlayer;
        a.audioElementsLoaded += 1, a.audioElementsLoaded == a.audioElements.length;
    }
}, events = {
    events: {},
    on: function(a, b) {
        this.events[a] = this.events[a] || [], this.events[a].push(b);
    },
    off: function(a, b) {
        if (this.events[a]) for (var c = 0; c < this.events[a].length; c++) if (this.events[a][c] === b) {
            this.events[a].splice(c, 1);
            break;
        }
    },
    emit: function(a, b) {
        this.events[a] && this.events[a].forEach(function(a) {
            a(b);
        });
    }
}, Gallery = {
    html: "",
    isOrientationChecked: !1,
    _sceneImageNames: [],
    _portraitImageNames: [],
    _sceneImages: [],
    _sceneImagesComments: [],
    _portraitImages: [],
    _portraitImagesComments: [],
    _presentedImageIndex: -1,
    _isPresentedImageSceneImage: !1,
    init: function() {
        var a = Gallery;
        $.ajax({
            url: "include/db_scene_images.php",
            type: "POST",
            dataType: "json",
            async: !1,
            success: function(b) {
                $.each(b, function(b, c) {
                    a._sceneImageNames.push(c);
                }), a._numberOfSceneImages = 0, $.each(a._sceneImageNames, function(b, c) {
                    a._addSceneImage(c.thumb, c.big, c.comment), a._numberOfSceneImages++;
                });
            }
        }), $.ajax({
            url: "include/db_portr_images.php",
            type: "POST",
            dataType: "json",
            async: !1,
            success: function(b) {
                $.each(b, function(b, c) {
                    a._portraitImageNames.push(c);
                }), a._numberOfPortraitImages = 0, $.each(a._portraitImageNames, function(b, c) {
                    a._addPortraitImage(c.thumb, c.big, c.comment), a._numberOfPortraitImages++;
                });
            }
        }), a._makeHTML();
    },
    activate: function() {
        var a = Gallery, b = .254 * window.innerHeight, c = b * (Math.floor(a._sceneImages.length / 2) + 1), d = b * a._portraitImages.length + 1;
        a._sceneMaxScrollWidth = c - .7 * window.innerWidth, a._portraitMaxScrollWidth = d - .7 * window.innerWidth, 
        $(".scene-images-container").css("width", c), $(".portrait-images-container").css("width", d), 
        a.arrowLeft = new Image(), a.arrowLeft.src = "icons_e/arrow-left.svg", a.arrowLeft.className = "arrow-left", 
        a.arrowRight = new Image(), a.arrowRight.src = "icons_e/arrow-right.svg", a.arrowRight.className = "arrow-right", 
        a.closeIcon = new Image(), a.closeIcon.src = "icons_e/close_24px.svg", a.closeIcon.className = "close-icon", 
        a.downloadIcon = new Image(), a.downloadIcon.src = "icons_e/download_24px.svg", 
        a.downloadIcon.className = "download-icon", a.isOrientationChecked || (a.isOrientationChecked = !0, 
        $.each(a._sceneImages, function(a, b) {
            var c = b.getThumb();
            c.width > c.height ? ($(c).addClass("landscape"), b.setBigClass("landscape")) : ($(c).addClass("portrait"), 
            b.setBigClass("portrait"));
        }), $.each(a._portraitImages, function(a, b) {
            var c = b.getThumb();
            c.width > c.height ? ($(c).addClass("landscape"), b.setBigClass("landscape")) : ($(c).addClass("portrait"), 
            b.setBigClass("portrait"));
        })), $(".image-wrapper").find("img").click(a._imageClickHandler), a.navMenuItem = $(".sehen-kloetzchen")[0], 
        a._activateNavigation();
    },
    deactivate: function() {
        var a = Gallery;
        a._deactivateNavigation(), a.isMouseDown = !1;
    },
    getMarkUp: function() {
        $(".sehen").html();
        return Gallery.html;
    },
    callback: function() {
        self = Gallery, self.scrollWidth = parseInt($(".sehen-scroll-div").css("width"), 10), 
        newItemPos = 0, $(".sehen-kloetzchen").animate({
            left: newItemPos
        }, 500);
        var a = newItemPos / (self.scrollWidth - 32);
        $(".scene-images-container").animate({
            left: -a * self._sceneMaxScrollWidth
        }, 500), $(".portrait-images-container").animate({
            left: -a * self._portraitMaxScrollWidth
        }, 500);
    },
    _activateNavigation: function() {
        var a = Gallery;
        $(a.navMenuItem).off(), $(".sehen-scroll-div")[0].addEventListener("mousedown", a._mouseDownHandler, !1), 
        document.body.addEventListener("mouseup", a._mouseUpHandler, !1), document.body.addEventListener("mousemove", a._mouseMoveHandler, !1), 
        $(".content").mousewheel(a.mouseScrollHandler), $(document).on("touchstart", ".scene-images-container", a.touchStartHandler), 
        $(document).on("touchend", "body", a.touchEndHandler), $(document).on("touchmove", "body", a.touchMoveHandler);
    },
    _mouseDownHandler: function(a) {
        var b = Gallery, c = $(".sehen-scroll-div")[0].getBoundingClientRect(), d = c.left, e = parseInt($(b.navMenuItem).css("left"), 10), f = a.pageX - d;
        if (f = 24 > f ? 24 : f, b.oldNavItemPos = e, b.startX = a.pageX, b.isMouseDown = !0, 
        e > f || f > e) {
            $(b.navMenuItem).css({
                left: f - 24
            }), b.oldNavItemPos = f - 24;
            var g = f / (b.scrollWidth - 48);
            $(".scene-images-container").css("left", -g * b._sceneMaxScrollWidth), $(".portrait-images-container").css("left", -g * b._sceneMaxScrollWidth);
        }
    },
    _mouseUpHandler: function() {
        Gallery.isMouseDown = !1;
    },
    _mouseMoveHandler: function(a) {
        var b = Gallery;
        if (b.isMouseDown) {
            var c = b.oldNavItemPos + (a.pageX - b.startX);
            c = 0 > c ? 0 : c, c = c > b.scrollWidth - 48 ? b.scrollWidth - 48 : c, $(b.navMenuItem).css("left", c + "px");
            var d = c / (b.scrollWidth - 48);
            $(".scene-images-container").css("left", -d * b._sceneMaxScrollWidth), $(".portrait-images-container").css("left", -d * b._sceneMaxScrollWidth);
        }
    },
    _deactivateNavigation: function() {
        var a = Gallery;
        a.navMenuItem.removeEventListener("mousedown", a._mouseDownHandler), document.body.removeEventListener("mouseup", a._mouseUpHandler), 
        document.body.removeEventListener("mousemove", a._mouseMoveHandler), $(".content").off(), 
        $(".menu-item").eq(3).on("click", function() {
            events.emit("itemClicked", $(this).index());
        });
    },
    _makeHTML: function() {
        var a = Gallery, b = $("<div class='gallery-content-wrapper'></div>"), c = $("<div class='image-wrapper'>"), d = $("<div class='scene-images-container'></div>"), e = $("<div class='portrait-images-container'></div>");
        $.each(a._sceneImages, function(a, b) {
            var c = $("<div class='scene-div-" + a + "'>");
            c.append(b.getThumb()), d.append(c);
        }), $.each(a._portraitImages, function(a, b) {
            var c = $("<div class='portrait-div-" + a + "'>");
            c.append(b.getThumb()), e.append(c);
        }), c.append(d), c.append(e), b.append(c), b.append($("<div class='sehen-scroll-div-wrapper'><div class='sehen-scroll-div'><div class='strich'></div><div class='sehen-kloetzchen'></div></div></div>")), 
        Gallery.html = b;
    },
    _addSceneImage: function(a, b, c) {
        var d = Gallery, e = d._sceneImages.length + 1;
        d._sceneImages.push(new Thumbnail("images/" + a, "images/" + b, "thumb_" + e, "big_" + e)), 
        d._sceneImagesComments.push(c);
    },
    _addPortraitImage: function(a, b, c) {
        var d = Gallery, e = d._portraitImages.length + 1;
        d._portraitImages.push(new Thumbnail("images/" + a, "images/" + b, "thumb_" + e, "big_" + e)), 
        d._portraitImagesComments.push(c);
    },
    _imageClickHandler: function(a) {
        var b = Gallery, c = $(this).closest("div");
        b._presentedImageIndex = c.index();
        var d = c[0].className;
        "sce" == d.substring(0, 3) ? b._presentSceneImage(b._presentedImageIndex) : b._presentPortraitImage(b._presentedImageIndex), 
        $(".arrow-right").click(b._arrowRightClickHandler.bind(b)), $(".arrow-left").click(b._arrowLeftClickHandler.bind(b)), 
        $(".close-icon").on("click", b._closeImage);
    },
    _presentSceneImage: function(a) {
        var b = Gallery;
        $(".overlay").remove();
        var c = document.createElement("div");
        c.className = "overlay";
        var d = document.createElement("div");
        d.className = "presentation", b._sceneImages[a]._loadBig();
        var e = b._sceneImages[a].getBig();
        e.className = b._sceneImages[a].bigClass;
        $(".scene-images-container>div").eq(a).find("img")[0];
        $image = $(e);
        var f = $("<div class='image-comment'>" + b._sceneImagesComments[a] + "</div>");
        d.appendChild($image[0]), d.appendChild(f[0]), c.appendChild(d), c.appendChild(b.closeIcon), 
        c.appendChild(b.arrowLeft), c.appendChild(b.arrowRight), b._isPresentedImageSceneImage = !0, 
        $("body").append(c);
    },
    _presentPortraitImage: function(a) {
        var b = Gallery;
        $(".overlay").remove();
        var c = document.createElement("div");
        c.className = "overlay";
        var d = document.createElement("div");
        d.className = "presentation", b._portraitImages[a]._loadBig();
        var e = b._portraitImages[a].getBig();
        e.className = b._portraitImages[a].bigClass, $image = $(e);
        var f = $("<a href = '" + [ "image_download/PORTR_1_FULL.jpg", "image_download/PORTR_2_FULL.jpg", "image_download/PORTR_3_FULL.jpg" ][a] + "' class='download-icon' download data-tooltip='In voller Qualität herunterladen.'></a> ")[0];
        f.appendChild(b.downloadIcon);
        var g = $("<div class='image-comment'>" + b._portraitImagesComments[a] + "</div>");
        d.appendChild($image[0]), d.appendChild(g[0]), c.appendChild(d), c.appendChild(b.closeIcon), 
        c.appendChild(f), c.appendChild(b.arrowLeft), c.appendChild(b.arrowRight), b._isPresentedImageSceneImage = !1, 
        $("body").append(c);
    },
    _closeImage: function() {
        $(".overlay").remove();
    },
    _arrowLeftClickHandler: function() {
        var a = Gallery, b = a._presentedImageIndex;
        b--, a._isPresentedImageSceneImage ? (0 > b && (b = a._numberOfSceneImages - 1), 
        a._presentSceneImage(b)) : (0 > b && (b = a._numberOfPortraitImages - 1), a._presentPortraitImage(b)), 
        $(".arrow-right").click(a._arrowRightClickHandler.bind(a)), $(".arrow-left").click(a._arrowLeftClickHandler.bind(a)), 
        $(".close-icon").on("click", a._closeImage), a._presentedImageIndex = b;
    },
    _arrowRightClickHandler: function() {
        var a = Gallery, b = a._presentedImageIndex;
        b++, a._isPresentedImageSceneImage ? (b >= a._numberOfSceneImages && (b = 0), Gallery._presentSceneImage(b)) : (b >= a._numberOfPortraitImages && (b = 0), 
        Gallery._presentPortraitImage(b)), $(".arrow-right").click(a._arrowRightClickHandler.bind(a)), 
        $(".arrow-left").click(a._arrowLeftClickHandler.bind(a)), $(".close-icon").on("click", a._closeImage), 
        a._presentedImageIndex = b;
    },
    mouseScrollHandler: function(a) {
        var b = Gallery, c = parseInt($(".sehen-kloetzchen").css("left"), 10) + 40 * a.deltaY;
        c = 0 > c ? 0 : c, c = c > b.scrollWidth - 48 ? b.scrollWidth - 48 : c, $(b.navMenuItem).css("left", c + "px");
        var d = c / (b.scrollWidth - 48);
        $(".scene-images-container").css("left", -d * b._sceneMaxScrollWidth), $(".portrait-images-container").css("left", -d * b._sceneMaxScrollWidth), 
        b.oldNavItemPos = c;
    },
    touchStartHandler: function(a) {
        var b = Gallery, c = $(".sehen-scroll-div")[0].getBoundingClientRect(), d = c.left;
        parseInt($(b.navMenuItem).css("left"), 10);
        b.startX = a.originalEvent.touches[0].pageX;
        var e = b.startX - d;
        e = 24 > e ? 24 : e, b.oldSehenLeft = parseInt($(".scene-images-container").css("left"), 10), 
        b.isTouch = !0;
    },
    touchEndHandler: function() {
        var a = Gallery;
        a.isTouch = !1;
    },
    touchMoveHandler: function(a) {
        if (Gallery.isTouch) {
            var b = Gallery, c = a.originalEvent.touches[0].pageX - b.startX, d = b.oldSehenLeft + c;
            d = d > 0 ? 0 : d, d = d < -b._sceneMaxScrollWidth ? -b._sceneMaxScrollWidth : d, 
            $(".scene-images-container").css("left", d + "px"), $(".portrait-images-container").css("left", d + "px"), 
            console.log("Old: " + b.oldSehenLeft + "  delta: " + c + " New: " + d);
            var e = -d * (b.scrollWidth - 32) / b._sceneMaxScrollWidth;
            $(".sehen-kloetzchen").css("left", e);
        }
    }
};

$(function() {
    vc = new VController(), $(".menu-item").on("click", function() {
        events.emit("itemClicked", $(this).index());
    }), $(".home-button").on("click", function() {
        events.emit("homeClicked");
    }), window.onresize = function() {
        events.emit("resize");
    }, events.on("itemClicked", function(a) {
        vc.clickHandler.bind(vc)(a);
    }), events.on("homeClicked", function() {
        vc.clickHandler.bind(vc)("home");
    });
});

var Item = function() {
    function a(a, b, c, d, e, f, g, h) {
        this._$obj = a, this._$svg = a.find("svg"), this._$text = a.find("text"), this._x = b, 
        this._y = c, this._width = d, this._height = e, this._fontSize = f, this._opacity = g, 
        this._browser = h, this._init();
    }
    return a.prototype._init = function() {
        0 != this._$text.length && this._$text[0].setAttribute("textLength", 300);
    }, a.prototype._render = function() {}, a.prototype._animateXY = function(a, b, c, d) {
        var e = this;
        d = d || 1.5, TweenMax.to(e._$obj, d, {
            left: a,
            top: b,
            onComplete: c,
            ease: Power1.easeInOut
        });
    }, a.prototype._animateWidth = function(a, b, c) {
        var d = this;
        return c = c || 1.5, -1 == a ? void TweenMax.to(d._$svg, c, {
            width: 300,
            onComplete: b,
            ease: Back.easeInOut
        }) : (TweenMax.to(d._$svg, c, {
            width: a,
            onComplete: b,
            ease: Back.easeInOut
        }), d._$text && TweenMax.to(d._$text, c, {
            attr: {
                textLength: a > 5 ? a - 5 : 0
            },
            ease: Back.easeInOut
        }), void (d._$obj.find("img") && TweenMax.to(d._$obj.find("img"), c, {
            width: a,
            ease: Back.easeInOut
        })));
    }, a.prototype._animateHeight = function(a, b, c) {
        var d = this;
        c = c || 1.5, d._$svg.attr({
            height: a
        }), "Chrome" != this._browser && "Firefox" != this._browser && "Microsoft Internet Explorer" != this._browser && "Safari" != this._browser ? d._$text.attr({
            y: a - 5
        }) : d._$text.attr({
            y: -5
        }), TweenMax.to(d._$svg, c, {
            attr: {
                height: a
            },
            onComplete: b
        }), TweenMax.to(d._$text, c, {
            y: a
        });
    }, a.prototype._animateFontSize = function(a, b, c) {
        var d = this;
        c = c || 1.5, void 0 != d._$text && (TweenMax.to(d._$obj, c, {
            y: 7.5 * a,
            onComplete: b,
            ease: Power1.easeInOut
        }), TweenMax.to(d._$text, c, {
            "font-size": 15 * a,
            ease: Power1.easeInOut
        }));
    }, a.prototype._animateOpacity = function(a, b, c) {
        var d = this;
        c = c || 1.5, TweenMax.to(d._$obj, c, {
            opacity: a,
            onComplete: b
        });
    }, a.prototype.setAnimationFunction = function(a, b) {}, a.prototype.stretch = function(a, b) {
        this._width != a ? (this._width = a, this._animateWidth(a, b)) : b();
    }, a.prototype.move = function(a, b, c) {
        this._x != a || this._y != b ? (this._x = a, this._y = b, this._animateXY(a, b, c)) : c();
    }, a.prototype.changeHeight = function(a, b) {
        this._height != a ? (this._height = a, this._animateHeight(a, b)) : b();
    }, a.prototype.changeFontSize = function(a, b) {
        this._fontSize != a ? (this._fontSize = a, this._animateFontSize(a, b)) : b();
    }, a.prototype.changeOpacity = function(a, b) {
        this._opacity != a ? (this._opacity = a, this._animateOpacity(a, b)) : b();
    }, a.prototype.render = function(a, b, c, d, e, f) {
        var g = this;
        this._x = a || this._x, this._y = b || this._y, this._width = c || this._width, 
        this._height = d || this._height, this._fontSize = e || this._fontSize, this._opacity = f || this._opacity, 
        this._animateXY(g._x, g._y, function() {}, .1);
    }, a;
}(), State = function() {
    function a(a, b) {
        this._name = a, this.x = [], this.y = [], this.width = [], this.height = [], this.fontSize = [], 
        this.opacity = [];
        for (var c = 0; c < b.length; c++) this.x.push(b[c].x), this.y.push(b[c].y), this.width.push(b[c].width), 
        this.height.push(b[c].height), this.fontSize.push(b[c].fontSize), this.opacity.push(b[c].opacity);
    }
    return a.prototype.getName = function() {
        return this._name;
    }, a;
}(), MenuStates = function(a, b, c) {
    function d() {
        this._numberItems = 0, this._states = [];
    }
    return d.prototype.addState = function(a, b) {
        b instanceof State ? (this._states[a] = b, this._numberOfItems = this._states.length) : console.log("MenuStates: Couldn't add state " + b + ".");
    }, d.prototype.removeState = function(a) {
        delete this._states[a], this._numberOfItems = this._states.length;
    }, d.prototype.getState = function(a) {
        return this._states[a];
    }, d;
}(window, document);