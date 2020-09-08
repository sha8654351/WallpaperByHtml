function elecClock() {
	var digElemArr = document.querySelectorAll('div.num');
	var yearElemArr = document.querySelectorAll('div.yyyy');
	var monElemArr = document.querySelectorAll('div.mm');
	var dateElemArr = document.querySelectorAll('div.dd');
	
	function setTime () {
		var currentTimeArr = /\s(\d)(\d)\:(\d)(\d)\:(\d)(\d)\s/.exec(new Date().toString());
		for (var i = 1; i < currentTimeArr.length; i ++) {
			digElemArr[i-1].setAttribute('class', 'num digit' + currentTimeArr[i]);
		}
	}
	function setCalendar () {
		var currentDay = /^.{3}/.exec(new Date().toString())[0];
		var year = (new Date().getFullYear());
		var mon  = ((new Date().getMonth()) + 1 < 10) ? "0" + ((new Date().getMonth()) + 1) : (new Date().getMonth()) + 1;
		var date = ((new Date().getDate()) < 10) ? "0" + ((new Date().getDate())) : (new Date().getDate());
		
		var yearArr = year.toString(10).replace(/\D/g, '0').split('').map(Number);
		var monArr = mon.toString(10).replace(/\D/g, '0').split('').map(Number);
		var dateArr = date.toString(10).replace(/\D/g, '0').split('').map(Number);
		for (var i = 0; i < yearArr.length; i ++) {
			yearElemArr[i].setAttribute('class', 'yyyy day-digit' + yearArr[i]);
		}
		for (var i = 0; i < monArr.length; i ++) {
			monElemArr[i].setAttribute('class', 'mm day-digit' + monArr[i]);
		}
		for (var i = 0; i < dateArr.length; i ++) {
			dateElemArr[i].setAttribute('class', 'dd day-digit' + dateArr[i]);
		}
	}
	
	setTime();
	setCalendar();
	setInterval(setTime, 1000);
	setInterval(setCalendar, 1000 * 60);
	
	//$.getJSON("main/img/picUrl.json", function( data ) {
	//	$.each( data, function( key, val ) {
	//		if ('Lamy' == key) {
	//			$('#main').css("background-image", 'url(' + val[0].localUrl + ')');
	//			$('.clock').css("top", val[0].top);
	//			$('.clock').css("left", val[0].left);
	//		}
	//	});
	//});
}