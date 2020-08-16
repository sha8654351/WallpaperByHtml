var noise = new SimplexNoise();

var renderer,
    scene,
    camera,
    composer,
    lights,
    circle,
    skelet,
    particle,
    planet,
    planet2,
    audioArray,
    user_audio_amp,
    audio_wireframe = true,
    primaryColor = null,
    secondaryColor = null,
    thirdColor = null,
    bg_file,
    move_bg,
    bass_wireframe;

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {

        function getRgb(prop) {
            var customColor = prop.value.split(' ');
            customColor = customColor.map(function (c) {
                return Math.ceil(c * 255);
            });
            return 'rgb(' + customColor + ')';
        }

        if (primaryColor === null) {
            primaryColor = getRgb(properties.primary_color)
        }

        if (secondaryColor === null) {
            secondaryColor = getRgb(properties.secondary_color)
        }

        if (thirdColor === null) {
            thirdColor = getRgb(properties.third_color)
        }

        if (properties.primary_color) {
            primaryColor = getRgb(properties.primary_color)
            setBackground()
        }

        if (properties.secondary_color) {
            secondaryColor = getRgb(properties.secondary_color)
            setBackground()
        }

        if (properties.third_color) {
            thirdColor = getRgb(properties.third_color)
            setBackground()
        }

        if (properties.custom_image) {
            bg_file = properties.custom_image.value
            setBackground()
        }
        
        if (properties.show_snow) {
        	var isShow = properties.show_snow.value;
        	document.getElementById('snow-container').style.display = (isShow) ? "inline-block" : "none";
        }
        if (properties.show_calendar) {
        	var isShow = properties.show_calendar.value;
        	document.getElementById('calendar').style.display = (isShow) ? "inline-block" : "none";
        }

        if (properties.calendar_x) {
        	document.getElementById('calendar').style.left = properties.calendar_x.value + "px";
        }

        if (properties.calendar_y) {
        	document.getElementById('calendar').style.top = properties.calendar_y.value + "px";
        }

        if (properties.calendar_color) {
        	setCalendarColor(getRgb(properties.calendar_color));
        }

        if (properties.show_clock) {
        	var isShow = properties.show_clock.value;
        	document.getElementById('clock').style.display = (isShow) ? "inline-block" : "none";
        }

        if (properties.clock_x) {
        	document.getElementById('clock').style.left = properties.clock_x.value + "px";
        }

        if (properties.clock_y) {
        	document.getElementById('clock').style.top = properties.clock_y.value + "px";
        }

        if (properties.clock_color) {
        	setClockColor(getRgb(properties.clock_color));
        }
    }
}

window.onload = function () {
    init();
    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "" +
    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

function setClockColor(calendarColor) {
	for (var j = 1; j <= 7; j++) {
		var classList = document.getElementsByClassName('cell' + j);
	    for (var i = 0; i < classList.length; i++) {
	    	classList[i].style.backgroundColor = calendarColor;
	    	classList[i].style.boxShadow = "0 0 1em " + calendarColor;
		}
    }
}

function setCalendarColor(calendarColor) {
    for (var j = 1; j <= 7; j++) {
        var classList = document.getElementsByClassName('yearCell' + j);
        for (var i = 0; i < classList.length; i++) {
        	classList[i].style.backgroundColor = calendarColor;
        	classList[i].style.boxShadow = "0 0 1em " + calendarColor;
    	}
    }
    
    for (var j = 1; j <= 7; j++) {
        var classList = document.getElementsByClassName('monthCell' + j);
        for (var i = 0; i < classList.length; i++) {
        	classList[i].style.backgroundColor = calendarColor;
        	classList[i].style.boxShadow = "0 0 1em " + calendarColor;
    	}
    }
    
    for (var j = 1; j <= 7; j++) {
        var classList = document.getElementsByClassName('dateCell' + j);
        for (var i = 0; i < classList.length; i++) {
        	classList[i].style.backgroundColor = calendarColor;
        	classList[i].style.boxShadow = "0 0 1em " + calendarColor;
    	}
    }
    
    var classDateLineBef = document.getElementsByClassName('dateLine1');
    for (var i = 0; i < classDateLineBef.length; i++) {
    	classDateLineBef[i].style.backgroundColor = calendarColor;
    	classDateLineBef[i].style.boxShadow = "0 0 1em " + calendarColor;
	}
    
    var classDateLineAft = document.getElementsByClassName('dateLine2');
    for (var i = 0; i < classDateLineAft.length; i++) {
    	classDateLineAft[i].style.backgroundColor = calendarColor;
    	classDateLineAft[i].style.boxShadow = "0 0 1em " + calendarColor;
	}
}

function setBackground() {
    var pC = primaryColor,
        sC = secondaryColor,
        el = document.body;
    if (bg_file && bg_file !== "") {
        img = {};
        img.value = bg_file;
        document.body.style.backgroundImage = "url('file:///".concat(img.value) + "')";
        document.body.style.backgroundSize = window.screen.width + "px " + window.screen.height + "px";
        document.body.style.overflow = "hidden";
    }

    if (bg_file === "" || bg_file === undefined || bg_file === null) {
        var styleText = 'background: -webkit-linear-gradient(top, ' + pC + ' 0%, ' + sC + ' 100%);' +
        'background: -o-linear-gradient(top, ' + pC + ' 0%, ' + sC + ' 100%); ' +
        'background: -ms-linear-gradient(top, ' + pC + ' 0%,  ' + sC + ' 100%);' +
        'background: linear-gradient(to bottom, ' + pC + ' 0%,  ' + sC + ' 100%);';
        
        el.setAttribute('style', styleText);
    }
}

function wallpaperAudioListener(audioArr) {
    audioArray = audioArr;
}

function debug(write) {
    if (write === undefined) {
        write = 'undefined'
    } else if (write === "") {
        write = '""'
    }
    var debug = document.getElementById('info')
    debug.innerHTML = write
}

function init() {
	
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

