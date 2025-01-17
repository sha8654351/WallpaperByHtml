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
    primaryColor = null,
    secondaryColor = null,
    thirdColor = null,
    audioColor = null,
    backgroundSize,
    backgroundPosition,
    bgFile,
    audioMode,
    audioHeight,
    audioLineHeight;


var sakura = document.getElementById("sakura");
var showSakura = true;
var sakuratransparency = 0.15;


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

        // 預設音頻顏色
        if (audioColor === null) {
        	audioColor = getRgb(properties.audio_color);
        }

        if (properties.primary_color) {
            primaryColor = getRgb(properties.primary_color)
            setBackground();
            
            if (bgFile && bgFile !== "") {
            	document.body.style.backgroundColor = primaryColor;
            }
        }

        if (properties.secondary_color) {
            secondaryColor = getRgb(properties.secondary_color)
            setBackground()
        }

        if (properties.third_color) {
            thirdColor = getRgb(properties.third_color)
            setBackground()
        }
       	
        // 聲波顯示
        if (properties.audioprocessing) {
        	if (!properties.audioprocessing.value) {
        		var canvas = document.getElementById("audios");
        		var ctx = canvas.getContext("2d");
        		ctx.clearRect(0, 0, canvas.width, canvas.height);
        	}
        }
        
        // 聲波顏色
        if (properties.audio_color) {
        	audioColor = getRgb(properties.audio_color)
            setAudioColor()
        }
       	
        // 聲波顯示模式
        if (properties.audio_mode) {
        	audioMode = properties.audio_mode.value;
        }
       	
        // 聲波距離邊線長度
        if (properties.audio_Height) {
        	audioHeight = properties.audio_Height.value;
        }
       	
        // 聲波長度
        if (properties.audio_Line_Height) {
        	audioLineHeight = properties.audio_Line_Height.value;
        }

        // 背景設置
        if (properties.custom_image) {
            bgFile = properties.custom_image.value
            setBackground()
        }

        // 背景樣式
        if (properties.imageStyle) {
            document.body.style.backgroundSize = properties.imageStyle.value;
        }

        // 背景位置
        if (properties.imagePosition) {
            document.body.style.backgroundPosition = properties.imagePosition.value;
        }
        
        // 是否顯示雪花/樱花特效
        if (properties.special_effects) {
        	if (properties.special_effects.value == "snow") {
            	document.getElementById('snow-container').style.display = "inline-block";
                makeCanvasHide(sakura);
        	} else if (properties.special_effects.value == "sakura") {
            	document.getElementById('snow-container').style.display = "none";
                makeCanvasFullScreen(sakura);
        	} else {
            	document.getElementById('snow-container').style.display = "none";
                makeCanvasHide(sakura);
        	}
        }

        //樱花透明度
        if(properties.sakuratransparency){
            sakuratransparency = properties.sakuratransparency.value/100;
            sakura.getContext('experimental-webgl').canvas.style.opacity = sakuratransparency
        }
        
        // 是否顯示日期
        if (properties.show_calendar) {
        	var isShowCalendar = properties.show_calendar.value;
        	if (isShowCalendar) {
        		$('.calendar').show();
        	} else {
        		$('.calendar').hide();
        	}
        }

        // 日期X軸位置
        if (properties.calendar_x) {
        	document.getElementById('calendar').style.left = properties.calendar_x.value + "%";
        }

        // 日期Y軸位置
        if (properties.calendar_y) {
        	document.getElementById('calendar').style.top = properties.calendar_y.value + "%";
        }

        // 日期顏色
        if (properties.calendar_color) {
        	setCalendarColor(getRgb(properties.calendar_color));
        }

        // 是否顯示時鐘
        if (properties.show_clock) {
        	var isShow = properties.show_clock.value;
        	if (isShow) {
        		$('.clock').show();
        	} else {
        		$('.clock').hide();
        	}
        }

        // 時鐘X軸位置
        if (properties.clock_x) {
        	$('.clock').css('left', properties.clock_x.value + "%");
        }

        // 時鐘Y軸位置
        if (properties.clock_y) {
        	$('.clock').css('top', properties.clock_y.value + "%");
        }

        // 時鐘顏色
        if (properties.clock_color) {
        	setClockColor(getRgb(properties.clock_color));
        }
        
//        console.log(window.navigator);
    }
}

function wallpaperAudioListener(audioArray) {
	// 音頻陣列為128
	var arr = new Array(128);
	
    for (var i = arr.length - 1; i >= 0; i--) {
        arr[i] = (Math.floor(audioArray[i]*1000));
    }
    
    audios(audioArray);
}

function audios(array){
	// 取得canvas標籤
	var canvas = document.getElementById("audios");
	// 調整canvas屬性
	var ctx = canvas.getContext("2d");
	
	// 每次寫入音頻時，清除前次的音頻
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	
	// 產生位置左方間隙
	var jx_left = 0;
	
	// 每個音條寬度。預設寬度為使用者螢幕寬度/128
	var jx_width = window.innerWidth/128;
	
	// 高度
	var jx_height = window.innerHeight;
	
	// 每個音條的間隙
	var spacing = 1;

	
	var jx_height, jx_lineHeight;
	// jx_height-高度位置。jx_lineHeight-音頻最高長度
	if ("top-bottom" == audioMode) {
		jx_height = audioHeight;
		jx_lineHeight = audioLineHeight * 100;
	} else {
		jx_height = window.innerHeight - audioHeight;
		jx_lineHeight = (0-audioLineHeight) * 100;
	}
	// 取得間隙後開始繪製
	for (var i = 0; i <= array.length-1; i++) {
		// 產生音頻
		ctx.fillRect(jx_left, jx_height, jx_width, array[i]*(jx_lineHeight));
		// 取得下一個音條的位置
		jx_left += jx_width+spacing;
    }
    // 音條顏色
    ctx.fillStyle = audioColor;
    // 畫上去
    ctx.fill();
    // 結束
    ctx.closePath();
}

// 設定音條顏色
function setAudioColor() {
	var canvas = document.getElementById("audios");
	var ctx = canvas.getContext("2d");
    ctx.fillStyle = audioColor;
}

// 取得RGB色碼
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "" +
    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

// 設定時鐘顏色
function setClockColor(clockColor) {
	for (var j = 1; j <= 7; j++) {
		var classList = document.getElementsByClassName('cell' + j);
	    for (var i = 0; i < classList.length; i++) {
	    	classList[i].style.backgroundColor = clockColor;
	    	classList[i].style.boxShadow = "0 0 1em " + clockColor;
		}
    }
    
    var dot = document.getElementsByClassName('dot');
    for (var i = 0; i < dot.length; i++) {
    	dot[i].style.backgroundColor = clockColor;
    	dot[i].style.boxShadow = "0 0 1em " + clockColor;
	}
}

// 設定日期顏色
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

// 設定背景圖片/顏色
function setBackground() {
    var pC = primaryColor,
        sC = secondaryColor,
        el = document.body;
    if (bgFile && bgFile !== "") {
        img = {};
        img.value = bgFile;
        document.body.style.backgroundImage = "url('file:///".concat(img.value) + "')";
//        document.body.style.backgroundSize = window.screen.width + "px " + window.screen.height + "px";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = backgroundSize;
        document.body.style.overflow = "hidden";
    	document.body.style.backgroundColor = pC;
    }

    if (bgFile === "" || bgFile === undefined || bgFile === null) {
        var styleText = 'background: -webkit-linear-gradient(top, ' + pC + ' 0%, ' + sC + ' 100%);' +
        'background: -o-linear-gradient(top, ' + pC + ' 0%, ' + sC + ' 100%); ' +
        'background: -ms-linear-gradient(top, ' + pC + ' 0%,  ' + sC + ' 100%);' +
        'background: linear-gradient(to bottom, ' + pC + ' 0%,  ' + sC + ' 100%);';
        
        el.setAttribute('style', styleText);
    }
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

window.onload = function () {
    init();
    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
}
