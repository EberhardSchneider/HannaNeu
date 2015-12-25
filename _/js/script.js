var Agenda = {
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
    deceleration: .9,
    isMouseDown: !1,
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
            dataType: "json",
            url: "include/events.json",
            success: function(b) {
                Agenda.numberOfEventboxes = 0;
                var c = "<div class='agenda'>";
                $.each(b, function(a, b) {
                    var d = "";
                    Agenda.numberOfEventboxes++, $.each(b.besetzung, function(a, b) {
                        d += "<div class='zeile'><span class='rolle'>" + a + ":</span><span class='darsteller'>" + b + "</span></div>";
                    }), c += '<div class="event">\r\n							<div class="event-up">\r\n								<div class="komponist">' + b.komponist + '</div>\r\n								<div class="title">' + b.title + '</div>\r\n								<div class="ort">' + b.ort + '</div>\r\n							</div>\r\n							<div class="event-date">\r\n								<div class="datum">' + b.datum + '</div>\r\n							</div>\r\n							<div class="event-low">\r\n								<div class="besetzung">' + d + "</div>\r\n							</div>\r\n						</div>";
                }), c += "</div>", a.html = c;
            }
        });
    },
    getMarkUp: function() {
        return Agenda.html;
    },
    activate: function() {
        var a = Agenda;
        a.activateNavigation();
    },
    deactivate: function() {
        Agenda.deactivateNavigation();
    },
    callback: function() {
        var a = this;
        a.eventBoxWidth = $(".event")[0].getBoundingClientRect().width, a.timelineLength = Agenda.numberOfEventboxes * a.eventBoxWidth, 
        $(".agenda").css("width", a.timelineLength + "px");
    },
    activateNavigation: function() {
        for (var a = document.getElementsByClassName("event"), b = 0; b < a.length; b++) $(".agenda")[0].addEventListener("mousedown", Agenda.mouseDownHandler, !1), 
        document.body.addEventListener("mouseup", Agenda.mouseUpHandler, !1), document.body.addEventListener("mousemove", Agenda.mouseMoveHandler, !1);
    },
    deactivateNavigation: function() {
        var a = Agenda;
        $(".agenda")[0], removeEventListener("mousedown", a.mouseDownHandler), document.body.removeEventListener("mouseup", a.mouseUpHandler), 
        document.body.removeEventListener("mouesemove", a.mosueMoveHandler);
    },
    animateTimeline: function() {
        var a = Agenda;
        $(".agenda").css("left", a.leftPos + "px");
    },
    mouseDownHandler: function(a) {
        var b = Agenda;
        if (!b.isMouseDown) {
            b.isMouseDown = !0, b.lastT = $.now(), $(".agenda").css("cursor", "move"), b.draggedObject.domElement = $(this), 
            b.draggedObject.x = a.pageX, b.draggedObject.y = a.pageY;
            var c = $(".agenda").css("left");
            c = c.substring(0, c.length - 2), b.oldLeftPos = parseInt(c), b.leftPos = b.oldLeftPos;
        }
    },
    mouseUpHandler: function(a) {
        var b = Agenda;
        b.scrollSpeed = 0, b.isMouseDown = !1, clearInterval(b.animateHandler), $(".agenda").css("cursor", "auto");
    },
    mouseMoveHandler: function(a) {
        var b = Agenda;
        if (Agenda.isMouseDown) {
            var c = Agenda.draggedObject.x - a.pageX;
            Agenda.deltaT = $.now() - Agenda.lastT, Agenda.lastT = $.now(), b.leftPos = b.oldLeftPos - c, 
            b.leftPos > 350 ? (b.leftPos = 300, Agenda.isMouseDown = !1) : b.leftPos < -b.timelineLength && (b.leftPos = -b.timelineLength, 
            Agenda.isMouseDown = !1), $(".agenda").css("left", b.leftPos + "px");
        }
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
        komponist: "Johann Adolf Mozart",
        titel: "Eine kleine Osterandacht",
        src: "audio/audio.mp3"
    }, {
        komponist: "Johann Rainer Mozart",
        titel: "Eine kleine Pfingstmusik",
        src: "audio/audio02.mp3"
    }, {
        komponist: "Johann Adolf Meier",
        titel: "Eine kleine Osterandacht",
        src: "audio/audio03.mp3"
    }, {
        komponist: "Klaus Adolf Mozart",
        titel: "Eine große Osterandacht",
        src: "audio/audio04.mp3"
    }, {
        komponist: "Johann Gustav Schubert",
        titel: "Eine kleine Verandaschlacht",
        src: "audio/audio05.mp3"
    } ],
    audioElements: [],
    audioElementsLoaded: 0,
    init: function() {
        var a = AudioPlayer;
        a.pauseIcon.src || (a.pauseIcon = new Image(), a.playIcon = new Image(), a.pauseIcon.src = "icons/pause-icon.svg", 
        a.playIcon.src = "icons/play-icon.svg", a.playIcon.className = "play-button-img", 
        a.pauseIcon.className = "play-button-img", a.audioSources.forEach(function(b, c) {
            a.audioElements[c] = new Audio(), a.audioElements[c].src = b.src, a.audioElements[c].titel = b.titel, 
            a.audioElements[c].komponist = b.komponist.toUpperCase(), a.audioElements[c].addEventListener("canplaythrough", a.audioReady, !1);
        })), $(".play-button").empty().append(a.playIcon);
        var b = "<div class='audio-image'><img src='images/hören.jpg' /></div><div class = 'audio'>", c = "";
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
        a.isAudioPlaying ? (a.stopCurrentPlaying(), $(".play-button").empty().append(a.playIcon)) : (a.pauseIcon.style.width = a.playIcon.width + "px", 
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
        console.log(a), b.playTrack(a);
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
        b.isMouseDown = !1, $(b.audioMenuItem).stop(), b.isAudioPlaying && b.stopCurrentPlaying(), 
        $(b.audioMenuItem).addClass("nav-audio"), b.isAudioPlaying = !0, b.currentTrackDiv = $(".audio-track").eq(a), 
        a != b.trackNumberPlaying && (b.audioElements[a].currentTime = 0), b.trackNumberPlaying = a, 
        b.pauseIcon.style.width = b.playIcon.width + "px", $(".play-button").empty().append(b.pauseIcon), 
        $(".selected").removeClass("selected"), b.currentTrackDiv.addClass("selected"), 
        clearInterval(b.timeUpdateHandler), clearInterval(b.navigationUpdateHandler), b.timeUpdateHandler = setInterval(b.timeUpdate, 1e3), 
        b.navigationUpdateHandler = setInterval(b.navigationUpdate, 30), b.audioElements[a].play(), 
        b.createTime(), b.createInfoBox(), b.initAudioNavigation(), b.timeUpdate();
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
            var c = a.pageX - b.startX, d = b.oldItemPos + c, e = 100 * (d - 74) / (window.innerWidth - b.audioMenuItemWidth - 60);
            e = e > 100 ? 100 : e, e = 0 > e ? 0 : e, b.navPerc = e;
            var f = b.audioElements[b.trackNumberPlaying];
            f.currentTime = b.navPerc * f.duration / 100, b.navigationUpdate(), b.timeUpdate();
        }
    },
    navigationUpdate: function() {
        var a = AudioPlayer, b = a.audioElements[a.trackNumberPlaying], c = b.currentTime / b.duration;
        b.duration - b.currentTime < 1 && !a.isMouseDown && a.playNextTrack();
        var d = c * (window.innerWidth - a.audioMenuItemWidth - 60) + 74;
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
        var b = document.createElement("div");
        b.className = "audio-info-box", b.innerHTML = "<span class='ort'>Kärnten</span><span class='jahr'>2014</span><span class='besetzung'>Sopran: Hanna Herfurtner</span><span class='besetzung'>Wiener Philharmoniker</span><span>Leitung: Sir Simon Rattle</span>", 
        a.currentTrackDiv.append(b);
        var c = a.currentTrackDiv[0].getBoundingClientRect(), d = c.top + 16, e = $(".audio-info-box").css("height"), f = parseInt(e.substring(0, e.length - 2));
        window.innerHeight;
        parseInt(d + f) > window.innerHeight ? ($(".audio-info-box").css("bottom", window.innerHeight - d + .01 * window.innerHeight + "px"), 
        $(".time-box").css("top", d + 3 + "px")) : $(".time-box").css("top", d - 16 + "px");
    },
    audioReady: function() {
        var a = AudioPlayer;
        a.audioElementsLoaded += 1, a.audioElementsLoaded == a.audioElements.length;
    }
}, Content = function(a, b, c) {
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
}(window, document), events = {
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
    _sceneImageNames: {
        "0": {
            thumb: "aschenputtel_hut.png",
            big: "aschenputtel_hut.png"
        },
        "1": {
            thumb: "aschenputtel_kleider.png",
            big: "aschenputtel_kleider.png"
        },
        "2": {
            thumb: "aschenputtel_lachend.png",
            big: "aschenputtel_lachend.png"
        },
        "3": {
            thumb: "gisela_abteil.png",
            big: "gisela_abteil.png"
        },
        "4": {
            thumb: "gisela_gold.png",
            big: "gisela_gold.png"
        },
        "5": {
            thumb: "judy_punch.jpeg",
            big: "judy_punch.jpeg"
        },
        "6": {
            thumb: "papagena_ei.png",
            big: "papagena_ei.png"
        },
        "7": {
            thumb: "what_what.jpg",
            big: "what_what.jpg"
        }
    },
    _portraitImageNames: {
        "0": {
            thumb: "portrait_1.jpg",
            big: "portrait_1.jpg"
        },
        "1": {
            thumb: "portrait_2.jpg",
            big: "portrait_2.jpg"
        },
        "2": {
            thumb: "portrait_2.jpg",
            big: "portrait_2.jpg"
        },
        "3": {
            thumb: "portrait_2.jpg",
            big: "portrait_2.jpg"
        }
    },
    _sceneImages: [],
    _portraitImages: [],
    init: function() {
        var a = Gallery;
        $.each(a._sceneImageNames, function(b, c) {
            a._addSceneImage(c.thumb, c.big);
        }), $.each(a._portraitImageNames, function(b, c) {
            a._addPortraitImage(c.thumb, c.big);
        }), a._makeHTML();
    },
    activate: function() {
        var a = Gallery, b = .21 * window.innerHeight, c = b * Math.floor(a._sceneImages.length / 2) + 1, d = b * a._portraitImages.length + 1;
        $(".scene-images-container").css("width", c), $(".portrait-images-container").css("width", d), 
        a.isOrientationChecked || (a.isOrientationChecked = !0, $.each(a._sceneImages, function(a, b) {
            var c = b.getThumb();
            c.width > c.height ? $(c).addClass("landscape") : $(c).addClass("portrait");
        }), $.each(a._portraitImages, function(a, b) {
            var c = b.getThumb();
            c.width > c.height ? $(c).addClass("landscape") : $(c).addClass("portrait");
        })), a.navMenuItem = $(".menu-item")[3];
        var e = $(a.navMenuItem).css("width");
        a.navMenuItemWidth = parseInt(e.substring(0, e.length - 2));
        var f = $(a.navMenuItem).css("height");
        a.navMenuItemHeight = parseInt(f.substring(0, f.length - 2)), a._activateNavigation(), 
        a.windowWidth = window.innerWidth - a.navMenuItemWidth + 80;
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
        self = Gallery, self._navItemStartPos = parseInt($(self.navMenuItem).css("left"), 10), 
        console.log(self._navItemStartPos);
    },
    _activateNavigation: function() {
        var a = Gallery;
        $(a.navMenuItem).off(), a.navMenuItem.addEventListener("mousedown", a._mouseDownHandler, !1), 
        document.body.addEventListener("mouseup", a._mouseUpHandler, !1), document.body.addEventListener("mousemove", a._mouseMoveHandler, !1);
    },
    _mouseDownHandler: function(a) {
        var b = Gallery;
        b.oldNavItemPos = parseInt(b.navMenuItem.style.left, 10), b.startX = a.pageX, console.log(b.oldNavItemPos + " .. : .. " + b.startX), 
        b.isMouseDown = !0;
    },
    _mouseUpHandler: function() {
        Gallery.isMouseDown = !1;
    },
    _mouseMoveHandler: function(a) {
        var b = Gallery;
        if (b.isMouseDown) {
            var c = b.oldNavItemPos + (a.pageX - b.startX);
            c = c < b._navItemStartPos ? b._navItemStartPos : c, $(b.navMenuItem).css("left", c + "px");
        }
    },
    _deactivateNavigation: function() {
        var a = Gallery;
        a.navMenuItem.removeEventListener("mousedown", a._mouseDownHandler), document.body.removeEventListener("mouseup", a._mouseUpHandler), 
        document.body.removeEventListener("mousemove", a._mouseMoveHandler), $(".menu-item").eq(3).on("click", function() {
            events.emit("itemClicked", $(this).index());
        });
    },
    _makeHTML: function() {
        var a = Gallery, b = $("<div class='image-wrapper'>"), c = $("<div class='scene-images-container'></div>"), d = $("<div class='portrait-images-container'></div>");
        $.each(a._sceneImages, function(a, b) {
            var d = $("<div class='scene-div-" + a + "'>");
            d.append(b.getThumb()), c.append(d);
        }), $.each(a._portraitImages, function(a, b) {
            var c = $("<div class='portrait-div-" + a + "'>");
            c.append(b.getThumb()), d.append(c);
        }), b.append(c), b.append(d), Gallery.html = b;
    },
    _addSceneImage: function(a, b) {
        var c = Gallery, d = c._sceneImages.length + 1;
        c._sceneImages.push(new Thumbnail("images/" + a, "images/" + b, "thumb_" + d, "big_" + d));
    },
    _addPortraitImage: function(a, b) {
        var c = Gallery, d = c._portraitImages.length + 1;
        c._portraitImages.push(new Thumbnail("images/" + a, "images/" + b, "thumb_" + d, "big_" + d));
    }
}, GalleryClass = function() {
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
}(), Item = function() {
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
            ease: Back.easeInOut
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
            }
        }), void (d._$obj.find("img") && TweenMax.to(d._$obj.find("img"), c, {
            width: a,
            ease: Back.easeInOut
        })));
    }, a.prototype._animateHeight = function(a, b, c) {
        var d = this;
        c = c || 1.5, d._$svg.attr({
            height: a
        }), "Firefox" != this._browser && "Microsoft Internet Explorer" != this._browser && d._$text.attr({
            y: a - 5
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
            ease: Back.easeInOut
        }), TweenMax.to(d._$text, c, {
            "font-size": 15 * a,
            ease: Back.easeInOut
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
}(), Kontakt = {
    getMarkUp: function() {
        var a = "<div class='kontakt-wrapper'>";
        return a += $(".kontakt").html(), a += "</div>";
    },
    activate: function() {
        var a = parseInt($(".menu-item").eq(4).css("top"), 10), b = $(".menu-item")[4].getBoundingClientRect().height;
        $(".kontakt-schablone").css({
            height: b + 20 + "px",
            top: 1.08 * a - 10 + "px",
            display: "none"
        }), $(".kontakt-schablone").fadeIn(0);
    },
    deactivate: function() {},
    callback: function() {}
}, MenuController = function(a, b, c) {
    function d(a, b) {
        var c = this;
        this._menuStates = new MenuStates(), this._items = [], this._currentState = "", 
        this._propertiesAnimated = 0, a.each(function(a, d) {
            c._items.push(new Item($(d), 0, 0, 0, 0, 0, 1, b));
        }), this._isMenuAnimating, events.on("stateChanges", function() {
            c._isMenuAnimating = !0;
        }), events.on("stateChanged", function() {
            c._isMenuAnimating = !1;
        });
    }
    return d.prototype.render = function() {
        var a = this, b = this._currentState;
        a._items.forEach(function(a, c) {
            a.render(b.x[c], b.y[c], b.width[c], b.height[c], b.fontSize[c], b.opacity[c]);
        });
    }, d.prototype._propertiesAnimationHandler = function() {
        var a = this;
        a._propertiesAnimated--, 0 === a._propertiesAnimated && events.emit("stateChanged");
    }, d.prototype.addState = function(a, b) {
        var d = this;
        console.log(a + ": " + d._menuStates.getState(a)), d._menuStates.getState(a) !== c ? (d._currentState.getName().trim() == a.trim() && (d._currentState = b), 
        d._menuStates.removeState(a), d._menuStates.addState(a, b)) : d._menuStates.addState(a, b);
    }, d.prototype.removeState = function(a) {
        this._menuStates.removeState(a);
    }, d.prototype.getCurrentStateName = function() {
        return "" !== this._currentState ? this._currentState.getName() : void 0;
    }, d.prototype.gotoState = function(a) {
        var b = this;
        if (this._isMenuAnimating !== !0) {
            var d = b._menuStates.getState(a);
            if (d === c) return void console.log("MenuController: State '" + a + "' doesn't exist.");
            if (d == b._currentState) return void (b._isMenuAnimating = !1);
            events.emit("stateChanges"), b._items.forEach(function(a, c) {
                b._propertiesAnimated += 5, a.move(d.x[c], d.y[c], b._propertiesAnimationHandler.bind(b)), 
                a.stretch(d.width[c], b._propertiesAnimationHandler.bind(b)), a.changeHeight(d.height[c], b._propertiesAnimationHandler.bind(b)), 
                a.changeFontSize(d.fontSize[c], b._propertiesAnimationHandler.bind(b)), a.changeOpacity(d.opacity[c], b._propertiesAnimationHandler.bind(b));
            }), this._currentState = d;
        }
    }, d;
}(window, document), State = function() {
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
}(window, document), Thumbnail = function() {
    function a(a, b, c, d) {
        this.sourceThumb = a, this.sourceBig = b, this.thumbClass = c, this.bigClass = d, 
        this.thumb_img = void 0, this.big_img = void 0, this._loadThumb(), this._loadBig();
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
    }, a;
}(), VController = function(a, b, c) {
    function d() {
        this._menuItems = [ "agenda", "vita", "hören", "sehen", "kontakt" ], this._init(), 
        this.mc.gotoState("home");
    }
    return d.prototype._init = function() {
        var a = this;
        this._detectBrowser();
        var b = $(".menu-item");
        b.push($(".home-button")), b.push($(".play-button")), b.push($(".menu-name")), b.push($(".menu-sopran")), 
        a.cc = new ContentController($(".content")), this.mc = new MenuController(b, this._browser), 
        AudioPlayer.init(), b.find("text").each(function() {
            $(this) !== c && ($(this)[0].setAttribute("textLength", 372), $(this)[0].setAttribute("y", 0));
        }), Agenda.init(), Gallery.init(), a.cc.addContent("agenda", new Content(Agenda.getMarkUp.bind(Agenda), Agenda.activate.bind(Agenda), Agenda.deactivate.bind(Agenda), Agenda.callback.bind(Agenda))), 
        a.cc.addContent("vita", new Content(Vita.getMarkUp.bind(Vita), Vita.activate.bind(Vita), Vita.deactivate.bind(Vita))), 
        a.cc.addContent("hören", new Content(AudioPlayer.getMarkUp.bind(AudioPlayer), AudioPlayer.activate.bind(AudioPlayer), AudioPlayer.deactivate.bind(AudioPlayer))), 
        a.cc.addContent("sehen", new Content(Gallery.getMarkUp.bind(Gallery), Gallery.activate.bind(Gallery), Gallery.deactivate.bind(Gallery), Gallery.callback.bind(Gallery))), 
        a.cc.addContent("kontakt", new Content(Kontakt.getMarkUp.bind(Kontakt), Kontakt.activate.bind(Kontakt), Kontakt.deactivate.bind(Kontakt), Kontakt.callback.bind(Kontakt))), 
        a.cc.addContent("home", new Content(function() {
            return "";
        }, function() {}, function() {})), events.on("resize", function() {
            a._calculatePositions(), a.mc.render();
        }), this._calculatePositions(), $(".menu-item").hover(function(a) {
            a.stopPropagation();
        });
    }, d.prototype._manageContent = function(a) {
        this.cc.getCurrentContentName();
        -1 == a ? newContentName = "home" : newContentName = this._menuItems[a], this.cc.changeContent(newContentName);
    }, d.prototype._calculatePositions = function() {
        var b = .22 * a.innerHeight, c = .07 * a.innerHeight, d = .3 * a.innerWidth, e = .29 * a.innerWidth;
        e = e > 300 ? 300 : e;
        for (var f = 10, g = 10, h = .005 * a.innerHeight, i = [], j = 0; 5 > j; j++) {
            var k = [ 372, 190, 318, 304, 410 ][j];
            i.push({
                x: d,
                y: b + j * c,
                width: k,
                height: c,
                fontSize: h,
                opacity: 1
            });
        }
        i.push({
            x: f,
            y: g,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), i.push({
            x: -130,
            y: b + 2.65 * c,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), i.push({
            x: d - 140,
            y: b - 104,
            width: 350,
            height: 128,
            fontSize: h / 2.5,
            opacity: 1
        }), i.push({
            x: d - 140,
            y: b - 66,
            width: 150,
            height: 128,
            fontSize: h / 2.5,
            opacity: 1
        }), this.mc.addState("home", new State("home", i));
        var l = [];
        this.mc.removeState("agenda"), l.push({
            x: 50,
            y: b,
            width: e,
            height: c,
            fontSize: h - .5,
            opacity: 1
        });
        for (var j = 1; 5 > j; j++) l.push({
            x: 10,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - 2,
            opacity: .7
        });
        l.push({
            x: f,
            y: g,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), l.push({
            x: -130,
            y: b + 2.65 * c,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), l.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), l.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("agenda", new State("agenda", l));
        var m = [];
        this.mc.removeState("vita");
        for (var j = 0; 5 > j; j++) 1 == j ? m.push({
            x: d,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - .5,
            opacity: 1
        }) : m.push({
            x: 10,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - 2,
            opacity: .7
        });
        m.push({
            x: f,
            y: g,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), m.push({
            x: -130,
            y: b + 2.65 * c,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), m.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), m.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("vita", new State("vita", m));
        var n = [];
        this.mc.removeState("hören");
        for (var j = 0; 5 > j; j++) 2 == j ? n.push({
            x: 74,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - .5,
            opacity: 1
        }) : n.push({
            x: 10,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - 2,
            opacity: .7
        });
        n.push({
            x: f,
            y: g,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), n.push({
            x: 5,
            y: b + 2.65 * c,
            width: a.innerHeight / 17,
            height: a.innerHeight / 17,
            fontSize: 0,
            opacity: 1
        }), n.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), n.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("hören", new State("hören", n));
        var o = [];
        this.mc.removeState("sehen");
        for (var j = 0; 5 > j; j++) 3 == j ? o.push({
            x: 50,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - .5,
            opacity: 1
        }) : o.push({
            x: 10,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - 2,
            opacity: .7
        });
        o.push({
            x: f,
            y: g,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), o.push({
            x: -130,
            y: b + 2.65 * c,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), o.push({
            x: d - 50,
            y: b - 30,
            width: 0,
            height: 0,
            fontSize: 0,
            opacity: 0
        }), o.push({
            x: d - 50,
            y: b - 30,
            width: 0,
            height: 0,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("sehen", new State("sehen", o));
        for (var p = [], j = 0; 5 > j; j++) 4 == j ? p.push({
            x: .25 * a.innerWidth,
            y: b + j * c,
            width: e + 20,
            height: c,
            fontSize: h - .5,
            opacity: 1
        }) : p.push({
            x: 10,
            y: b + j * c,
            width: e,
            height: c,
            fontSize: h - 2,
            opacity: .7
        });
        p.push({
            x: f,
            y: g,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 1
        }), p.push({
            x: -130,
            y: b + 2.65 * c,
            width: 64,
            height: 64,
            fontSize: 0,
            opacity: 0
        }), p.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), p.push({
            x: d - 50,
            y: b - 30,
            width: 128,
            height: 128,
            fontSize: 0,
            opacity: 0
        }), this.mc.addState("kontakt", new State("kontakt", p));
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
        "home" == a ? (this.mc.gotoState("home"), a = -1) : this.mc.gotoState(this._menuItems[a]), 
        this._manageContent(a);
    }, d;
}(window, document), Vita = {
    getMarkUp: function() {
        var a = "<div class='vita-wrapper'>";
        return a += $(".vita").html(), a += "</div>";
    },
    activate: function() {},
    deactivate: function() {}
};

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