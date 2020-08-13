function elecClock() {
	var digElemArr = document.querySelectorAll('div.num');
	var dayElemArr = document.querySelectorAll('div.days > span');
	function setTime () {
		var currentTimeArr = /\s(\d)(\d)\:(\d)(\d)\:(\d)(\d)\s/.exec(new Date().toString());
		for (var i = 1; i < currentTimeArr.length; i ++) {
			digElemArr[i-1].setAttribute('class', 'num digit' + currentTimeArr[i])
		}
	}
	function setWeek () {
		var currentDay = /^.{3}/.exec(new Date().toString())[0];
		for (var i = 0; i < dayElemArr.length; i ++) {
			var current = dayElemArr[i];
			if(current.innerHTML === currentDay) {
				current.classList.add('currentDay');
			} else {
				current.classList.remove('currentDay');
			}
		}
	}
	setTime();
	setWeek();
	setInterval(setTime, 1000);
	setInterval(setWeek, 1000 * 60);
}