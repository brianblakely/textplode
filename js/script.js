function pListen(e) {
	var splodeX,
		splodeY;
	if(e.pageX || e.pageY) {
		splodeX = e.pageX - this.offsetLeft;
		splodeY = e.pageY - this.offsetTop;
	} else if(e.clientX || e.clientY) {
		splodeX =
			e.clientX
			+ document.body.scrollLeft
			+ document.documentElement.scrollLeft
			- this.offsetLeft;
		splodeY =
			e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop
			- this.offsetTop;
	}

	textplode(this, {
		location: splodeX + ' ' + splodeY//,
		//rumbleDuration: 1500,
		//rumbleTimes: 20,
		//rumbleDirection: 'random'
	});
	
	this.removeEventListener('click', pListen);
	
	return false;
};
document.getElementById('textplode').addEventListener('click', pListen);

function rumble() {
	textplode(this, {
		//location: splodeX + ' ' + splodeY//,
		diameter: '300%',
		rumbleDuration: 1000,
		rumbleTimes: 9,
		rumbleDirection: 'sideways',
		dud: true
	});
}
var qUsers = document.getElementsByTagName('li');
for(var x=0, usersLen=qUsers.length; x<usersLen; ++x) {
	qUsers[x].addEventListener(
		'click',
		x === 1
			? rumble
			: pListen
	);
}

// PAGE-SPECIFIC JS
var psJS = {
    'section': function() {
    	
    }
}
var psJSFunc = psJS[document.documentElement.id]
if(psJSFunc) {
	psJSFunc();
}