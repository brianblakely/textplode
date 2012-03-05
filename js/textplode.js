// Wraps letters of an element and its child elements in a tag
function letterWrap(tag, el, sub) {
	var qContent = el.childNodes,
		contentLen = qContent.length,
		elCurr,
		currNT,
		letters,
		letLen,
		letHTML = [],
		newML = [];

	for(var x=0;x<contentLen;++x) {
		elCurr = qContent[x];
		currNT = elCurr.nodeType;
		
		if(currNT === 1) { // HTML element
			newML.push(
				letterWrap(tag, elCurr, true)
			);
		} else if(currNT === 3) { // Text node
			letters = elCurr.nodeValue;
			letLen = letters.length;
			letHTML = [];
			
			for(var y=0;y<letLen;++y) {
				letHTML.push('<'+tag+'>'+letters[y]+'</'+tag+'>');
			}
			
			newML.push(
				letHTML.join('')
			);
		}
	}
	
	if(sub) { // Is 'el' a sub-element?
		el.innerHTML = newML.join('');
		return el.outerHTML;
	} else {
		el.innerHTML = newML.join('');
		return el.querySelectorAll(tag);
	}
}

// This function makes an element's text content explode by-the-letter
function textplode(el, options) {
	if(getComputedStyle(el,null).position === 'static') {
		el.style.position = 'relative';
	}
	
	var elW = el.offsetWidth,
		elH = el.offsetHeight,
		loc = options.location || '50% 50%',
		locY,
		dud = options.dud || false,
		dist = options.diameter || '100%',
		dur = options.duration || 400,
		rmbl =
			options.rumble ||
				!!(options.rumbleDuration
				|| options.rumbleTimes
				|| options.rumbleDirection),
		rmblDur = options.rumbleDuration || 600,
		rmblRep = options.rumbleTimes || 10,
		rmblDir = options.rumbleDirection || 'random',
		rmblInt,
		fntSz = [],
		qShrap,
		currShrap,
		shrapLen,
		centerX,
		centerY,
		shrapX,
		shrapY,
		deltX = [],
		deltY = [],
		shrapSlope,
		shrapAngle,
		initDist,
		fadeTime = 0,
		collCoord,
		minDist,
		cornerSlope,
		yInt,
		elHead = document.getElementsByTagName('head')[0],
		elSplodeStyle = document.createElement('style');

	elSplodeStyle.textContent = [
		'x-shrapnel {',
			'position: relative;',
			'cursor: default;',
		
			'-webkit-transition: all 1s ease-out;',
			'-moz-transition: all 1s ease-out;',
			'-ms-transition: all 1s ease-out;',
			'-o-transition: all 1s ease-out;',
			'transition: all 1s ease-out;',
		'}'
	].join('');
	elHead.appendChild(elSplodeStyle);
		
	// Distance to launch shrapnel
	dist =
		typeof dist === 'string' // Is it a percentage?
			// All shrap flies at percentage of width
			? elW/2 + elW/2 * (parseFloat(dist)/100)
			// Or just use radius (diameter expected from user)
			: dist / 2;
	loc = loc.split(' ');
	locY = loc.length - 1;
	dur = parseInt(dur);
	
	
	centerX =
		~loc[0].indexOf('%')
			? elW*(parseFloat(loc[0])/100)
			: parseFloat(loc[0]);
	centerX =
		centerX === 0
			? -1
			: centerX;
	centerY =
		~loc[locY].indexOf('%')
			? elH*(parseFloat(loc[locY])/100)
			: parseFloat(loc[locY]);
	centerY =
		centerY === 0
			? -1
			: centerY;
	
	qShrap = letterWrap('x-shrapnel', el);
	shrapLen = qShrap.length;
	
	function textplode_pow() {
		for(var x=0;x<shrapLen;++x) {
			currShrap = qShrap[x];
			
			shrapX = currShrap.offsetLeft;
			shrapY = currShrap.offsetTop;
			
			shrapSlope = (shrapY - centerY) / (shrapX - centerX);
			shrapAngle = Math.atan(shrapSlope)*(180/Math.PI);
			yInt = shrapY - shrapSlope*shrapX;
			
			initDist =  Math.sqrt(Math.pow(shrapY-centerY,2) + Math.pow(shrapX-centerX,2));
			
			deltX = 
				shrapX <= centerX
					? -Math.abs(
						Math.cos(shrapAngle)*(dist-Math.abs(initDist))
					)
					: Math.abs(
						Math.cos(shrapAngle)*(dist-Math.abs(initDist))
					);
			deltY = 
				shrapY <= centerY
					? -Math.abs(
						Math.sin(shrapAngle)*(dist-Math.abs(initDist))
					)
					: Math.abs(
						Math.sin(shrapAngle)*(dist-Math.abs(initDist))
					);
			
			currShrap.style.webkitTransitionDuration =
			currShrap.style.mozTransitionDuration =
			currShrap.style.msTransitionDuration =
			currShrap.style.OTransitionDuration =
			currShrap.style.transitionDuration =
				dur+'ms';

			setTimeout(function(currShrap, deltX, deltY) {
				// Make Matrix effect work
				/*setTimeout(function() {
					currShrap.style.webkitTransitionDuration = dur*10+'ms';
					setTimout(function() {
						currShrap.style.webkitTransitionDuration = dur+'ms';
					}, dur/4);
				}, dur/4);*/
				
				return function() {
					currShrap.style.left = deltX+'px';
					currShrap.style.top = deltY+'px';
				};
			}(currShrap, deltX, deltY), 0);
			if(initDist > fadeTime) {
				fadeTime = initDist;
			}
		}
		
		setTimeout(function() {
			el.style.webkitTransition = 'opacity '+ (dur+fadeTime)*0.25+ 'ms ease-out';
			el.style.opacity = 0;
		}, (dur+fadeTime)*0.25);
		setTimeout(function() {
			el.parentNode.removeChild(el);
			elHead.removeChild(elSplodeStyle);
		}, dur+fadeTime);
	}
	
	if(rmbl) {
		for(var x=0;x<shrapLen;++x) {
			currShrap = qShrap[x];
			fntSz[x] = parseInt(window.getComputedStyle(currShrap,null).getPropertyValue("font-size"));
			deltX[x] =
				rmblDir === 'random'
					? Math.random() >= 0.5
						? dist/fntSz[x]
						: -dist/fntSz[x]
				: rmblDir === 'sideways'
					? Math.random() >= 0.5
						? dist/fntSz[x]
						: -dist/fntSz[x]
				: 0;
			deltY[x] =
				rmblDir === 'random'
					? Math.random() >= 0.5
						? dist/fntSz[x]
						: -dist/fntSz[x]
				: rmblDir === 'sideways'
					? 0
				: 0;
		}
		
		rmblInt = setInterval(function() {
			for(var x=0;x<shrapLen;++x) {
				currShrap = qShrap[x];
				currShrap.style.left = (deltX[x] = -deltX[x])+'px';
				currShrap.style.top  = (deltY[x] = -deltY[x])+'px';
				
			}
		}, rmblDur/rmblRep);
		setTimeout(function() {
			clearInterval(rmblInt);
			if(!dud) {
				textplode_pow();
			} else {
				for(var x=0;x<shrapLen;++x) {
					currShrap = qShrap[x];
					currShrap.style.left = '0';
					currShrap.style.top  = '0';
				}
			}
		}, rmblDur);
	} else if(!dud) {
		textplode_pow();
	}
}