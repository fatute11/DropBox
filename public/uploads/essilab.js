/**
 * Naysphere JS Library V 1.0 
 * Utilities method to refactor ASAP.
 */


//BetterInnerHTML v1.15 - by Craig Buckler, http://www.optimalworks.net/
//function BetterInnerHTML(_1,_2,_3){function Load(_4){var _5;if(typeof DOMParser!="undefined"){_5=(new DOMParser()).parseFromString(_4,"application/xml");}else{var _6=["MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"];for(var i=0;i<_6.length&&!_5;i++){try{_5=new ActiveXObject(_6[i]);_5.loadXML(_4);}catch(e){}}}return _5;}function Copy(_8,_9,_a){if(typeof _a=="undefined"){_a=1;}if(_a>1){if(_9.nodeType==1){var _b=document.createElement(_9.nodeName);for(var a=0,attr=_9.attributes.length;a<attr;a++){var _d=_9.attributes[a].name,aValue=_9.attributes[a].value,evt=(_d.substr(0,2)=="on");if(!evt){switch(_d){case "class":_b.className=aValue;break;case "for":_b.htmlFor=aValue;break;default:_b.setAttribute(_d,aValue);}}}_8=_8.appendChild(_b);if(evt){_8[_d]=function(){eval(aValue);};}}else{if(_9.nodeType==3){var _e=(_9.nodeValue?_9.nodeValue:"");var _f=_e.replace(/^\s*|\s*$/g,"");if(_f.length<7||(_f.indexOf("<!--")!=0&&_f.indexOf("-->")!=(_f.length-3))){_8.appendChild(document.createTextNode(_e));}}}}for(var i=0,j=_9.childNodes.length;i<j;i++){Copy(_8,_9.childNodes[i],_a+1);}}_2="<root>"+_2+"</root>";var _11=Load(_2);if(_1&&_11){if(_3!=false){while(_1.lastChild){_1.removeChild(_1.lastChild);}}Copy(_1,_11.documentElement);}}

var regExpBeginning = /^\s+/;
var regExpEnd = /\s+$/;  

//Supprime les espaces inutiles en début et fin de la chaîne passée en paramètre.

function trim(aString) {
	return aString.replace(regExpBeginning, "").replace(regExpEnd, "");
}
/** Import a javascript file (if not exists) */
function import_js(url) {
	// Check if given url already exists in head part.
	var scripts = document.getElementsByTagName("script");
	for (var i=0;i<scripts.length;i++) 
		if (scripts[i].src.match(".*"+url+"$"))
			return;
	// Add url.
	var script = new Element("script");
	script.text = AjaxSimpleRequest(url);
	document.getElementsByTagName("head")[0].appendChild(script);
	script.src = url;
}

function import_css(url) {
	// Check if given url already exists in head part.
	var csss = document.getElementsByTagName("link");
	for (var i=0;i<csss.length;i++) 
		if (csss[i].href.match(".*"+url+"$"))
			return;
	// Add url.
	var css = new Element("link");
	css.rel = "stylesheet";
	css.type = "text/css";
	css.href = url;
	document.getElementsByTagName("head")[0].appendChild(css);
	
}
function AjaxFormRequest( container, form )
{
	$request = $(form).request({
		asynchronous:false,
		evalJS:'force',
		parameters : { isAjax : true},
		onComplete: function(transport)
		{ 
		//	var d = document.createElement("div");
		//	d.innerHTML = transport.responseText;
			$(container).update(transport.responseText);
		}
	})
}

function AjaxRequest( container, url ) {
	new Ajax.Updater(container, url, {method:'get', evalScripts:true, asynchronous:false });
}


function AjaxSimpleRequest(url){    
	var XMLHTTP = Try.these(
			function() {return new XMLHttpRequest()},
			function() {return new ActiveXObject('Msxml2.XMLHTTP')},
			function() {return new ActiveXObject('Microsoft.XMLHTTP')}
	) || false;
	if(XMLHTTP){ XMLHTTP.open("GET", url, false);XMLHTTP.send(null);}
	else{ alert("Could not create XMLHTTP object");	}
	return  trim(XMLHTTP.responseText);
}

function AjaxPostRequest(url, parameters) {
	var text = new Object();
	Object.extend(text, {text:null})
	var response = new Ajax.Request( url, { asynchronous: false,
											method:'post', 
											parameters : parameters});
	return response.transport.responseText;
}
/**
 * @param container, to put response.
 * @param wrapper, to get url.
 */
function link_to_ajax(container, wrapper) {
	var links = $(wrapper).select("a");
	for (var i=0; i<links.length; i++) {
		links[i].observe("click", ajax_link.bind(links[i]));
		Object.extend(links[i], {url : links[i].href, container : container})
		links[i].href = "javascript:void(0)";
	}
}
function ajax_href(container, url){
	url +=  (url.match("\\?")) ? "&" : "?";
	url += "isAjax=true";
	var response = AjaxSimpleRequest(url);
	
	var allscript = response.extractScripts();
	$(container).update(response.stripScripts());
	for(var i=0;i< allscript.length;i++)
		window.eval(allscript[i]);
}
function ajax_link(){
	new Ajax.Updater(this.container, this.url, {method:'get', parameters : {isAjax : true}});
}

function AjaxQueryRequest(container, url, wrapper){    
	new Ajax.Updater($(container), url, {method:'get', evalScripts:true, asynchronous:false });
	var allscript = $(container).getElementsByTagName('script');
	for(var i=0;i< allscript.length;i++)
		window.eval(allscript[i].text);
}
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Object.extend(Element, {
	getX: function (element)
	{
		var curleft = 0;
		if (element.offsetParent)
		{
			while (element.offsetParent)
			{
				curleft += element.offsetLeft
				element = element.offsetParent;

			}
		}
		else if (element.x)
			curleft += element.x;
		return curleft;
	},
	getY: function (element)
	{
		var curtop = 0;
		if (element.offsetParent)
		{
			while (element.offsetParent)
			{
				curtop += element.offsetTop
				element = element.offsetParent;
			}
		}
		else if (element.y)
			curtop += element.y;
		return curtop;
	}
});

Object.extend(Event, {
	getX: function(e) {
		if (!e) var e = window.event;
		var posx = 0;
		if (e.pageX)
		{
			posx = e.pageX;
		}
		else if (e.clientX)
		{
			posx = e.clientX + document.body.scrollLeft;
		}
		return posx;
	},
	getY: function(e) {
		if (!e) var e = window.event;
		var posy = 0;
		if (e.pageY)
		{
			posy = e.pageY;
		}
		else if (e.clientY)
		{
			posy = e.clientY + document.body.scrollTop;
		}
		return posy;
	}
});

/*
if(Object.isUndefined(Effect))
	throw("natysphere.js requires including script.aculo.us' effects.js library");
 */
/*
betterSlidingDiv = Class.create();
betterSlidingDiv.prototype = {

		initialize: function(target, options) {
	var slidingdiv = this;
	this.node = $(target);
	var options = Object.extend({
		fps: 25,
		points: 10,
		stopOnExit: true,
		onSlideStart: null,
		onSlideUpdate: null,
		onSlideComplete: null,
		onSlideStop: null,
		style: null
	}, arguments[1] || {});
	this.options = options;
	this.blockScroll = false;
	this.scrolling = false;
	this.setup(this.node);

},

mouseIn: function (e) {
	this.blockScroll = false;
},

mouseOut: function (e) {
	this.blockScroll = true;
},

setup: function(t) {
	t.style.overflow = 'hidden';
	if (typeof this.options.style == 'object') {
		for (property in this.options.style) {
			t.style[property] = this.options.style[property];
		}
	}

	this.eventMouseMove = this.mouseMove.bindAsEventListener(this);
	this.eventMouseIn = this.mouseIn.bindAsEventListener(this);
	this.eventMouseOut = this.mouseOut.bindAsEventListener(this);
	Event.observe(t, 'mousemove', this.eventMouseMove, true);
	if (this.options.stopOnExit == true) {
		Event.observe(t, 'mouseover', this.eventMouseIn, true);
		Event.observe(t, 'mouseout', this.eventMouseOut);
	}

},

scrollTo: function(x,y) {

	if (x > (this.node.scrollWidth - parseInt(this.node.offsetWidth))) x = this.node.scrollWidth - parseInt(this.node.offsetWidth);
	if (y > (this.node.scrollHeight - parseInt(this.node.offsetHeight))) y = this.node.scrollHeight - parseInt(this.node.offsetHeight);

	//alert(this.node.scrollHeight - parseInt(this.node.style.height) + " " + y);

	if (this.clickScroll == true || this.scrolling == true) {

		clearInterval ( this.autoScroller );
		this.autoScroller = null;
		return;

	}

	var deltaX = 0;
	var deltaY = 0;

	deltaY = (this.node.scrollTop - y) / 4;
	deltaX = (this.node.scrollLeft - x) / 4;
	//alert(this.node.scrollTop + " " + y);
	if (deltaX > 0) {
		deltaX = Math.min(Math.round(deltaY), this.options.points);
	} else {
		deltaX = Math.max(Math.round(deltaY), -1 * this.options.points);
	}

	if (deltaY > 0) {
		deltaY = Math.min(Math.round(deltaX), this.options.points);

	} else {
		deltaY = Math.max(Math.round(deltaX), -1 * this.options.points);
	}
	this.node.scrollTop -= deltaY;
	this.node.scrollLeft -= deltaX;
	//alert(Math.min(Math.floor(deltaY), this.options.points));
	if (deltaY != 0 || deltaX != 0) {
		//alert("Recall");
		clearInterval ( this.autoScroller );
		this.autoScroller = setInterval(this.scrollTo.bind(this, x , y),1000/this.options.fps);
	} else {
		clearInterval ( this.autoScroller );
		this.autoScroller = null;
	}

},

mouseMove: function(e) {
	this.blockScroll = false; // Only useful if stopOnExit is true
	var posx = Event.getX(e);
	var posy = Event.getY(e);
	posy -= Element.getY(this.node);
	posx -= Element.getX(this.node);


	var pointx = parseInt(Element.getStyle(this.node,'width'))/2 - posx;
	var pointy = parseInt(Element.getStyle(this.node,'height'))/2 - posy;

	if (pointx < 0) { pointx = pointx * -1 }
	if (pointy < 0) { pointy = pointy * -1 }

	this.scrollX = (pointx * this.options.points) / (parseInt(Element.getStyle(this.node,'width'))/2);
	this.scrollY = (pointy * this.options.points) / (parseInt(Element.getStyle(this.node,'height'))/2);

	if (posx < parseInt(Element.getStyle(this.node,'width'))/2) { this.scrollX = this.scrollX * -1 }
	if (posy < parseInt(Element.getStyle(this.node,'height'))/2) { this.scrollY = this.scrollY * -1 }

	if (this.scrolling == false) {

		if (this.options.onSlideStart != null) {
			this.options.onSlideStart.bind(this)();
		}
		this.scroll();
	}
},

scroll: function() {
	if (this.blockScroll == true && this.options.stopOnExit == true) {
		this.scrolling = false;
		clearInterval(this.scrollTimer);
		this.scrollTimer = null;
		this.stopping = this.options.points;
		if (this.options.onSlideStop != null) {
			this.options.onSlideStop.bind(this)();
		}
		this.gentleStop();
		return;
	}

	this.scrolling = true;
	var stepX = Math.round(this.scrollX);
	var stepY = Math.round(this.scrollY);
	if ( stepX != 0 || stepY != 0) {
		if (this.doing != true) {

			this.doing = true;
			this.node.scrollTop += stepY;
			this.node.scrollLeft += stepX;
			if (this.options.onSlideUpdate != null) {
				this.options.onSlideUpdate.bind(this)();
			}
			this.doing = false;
		}

		var elH = parseInt(Element.getStyle(this.node,'height'));
		var elW = parseInt(Element.getStyle(this.node,'width'));            
		var againH = true;
		var againW = true;
		if (stepY >= 0) {
			//going down
			if ((elH + this.node.scrollTop) >= this.node.scrollHeight) againH = false;

		} else {
			if (this.node.scrollTop <= 0) againH = false;
		}

		if (stepX >= 0) {
			if ((elW + this.node.scrollLeft) >= this.node.scrollWidth) againW = false;
		} else {
			if (this.node.scrollLeft <= 0) againW = false;
		}

		if (!againH && !againW) {
			this.scrolling = false;
			clearInterval(this.scrollTimer);
			this.scrollTimer = null;
			if (this.options.onSlideComplete != null) {
				this.options.onSlideComplete.bind(this)();
			}
		} else {
			if (!this.scrollTimer) {
				this.scrollTimer = setInterval(this.scroll.bind(this),1000/this.options.fps);
			}
		}
	} else {
		this.scrolling = false;
		clearInterval(this.scrollTimer);
		this.scrollTimer = null;
		if (this.options.onSlideComplete != null) {
			this.options.onSlideComplete.bind(this)();
		}
	}
},

gentleStop: function() {

	if (this.scrolling == true) {
		//clear the interval!
		if (this.gentleScrollTimer) {
			clearInterval(this.gentleScrollTimer);
			this.gentleScrollTimer = null;
		}
		return;
	}

	if (this.stopping > 1) {
		this.stopping--;
	}

	var stepX = 0;
	var stepY = 0;

	if (this.scrollX > 0) {
		stepX = Math.floor(this.scrollX-1);
	}
	if (this.scrollX < 0) {
		stepX = Math.floor(this.scrollX+1);
	}
	if (this.scrollY > 0) {
		stepY = Math.floor(this.scrollY-1);
	}
	if (this.scrollY < 0) {
		stepY = Math.floor(this.scrollY+1);
	}

	this.node.scrollTop += stepY;
	this.node.scrollLeft += stepX;
	if (stepY != 0) this.scrollY = stepY;
	if (stepX != 0) this.scrollX = stepX;

	if (this.stopping > 1) {
		if (!this.gentleScrollTimer) this.gentleScrollTimer = setInterval(this.gentleStop.bind(this),1000/this.options.fps);
	} else {
		clearInterval(this.gentleScrollTimer);
		this.gentleScrollTimer = null;
	}
}
}  
ThumbnailScroller = Class.create({

	managedMedia : [],
	orderedMedia : [],

	initialize:function(element, options) 
	{
	var defaults = {

	}	
	this.orderedMedia = new Array();
	this.managedMedia = new Array();
	this.id = element;
	},

	init: function (element)
	{
		this.container = $(element);
		this.container.style.overflow = 'display';
		var scroller = this.container.firstDescendant();
		scroller.style.overflow = 'auto';
		//scroller.style.width='3000px';
		scroller.style.position = 'relative';
		scroller.style.width = 360 + "px";
		scroller.style.height = 80 + "px";
		scroller.style.whiteSpace= 'nowrap';
		scroller.style.backgroundColor = 'FFFFFF';
		scroller.style.textAlign = 'left';
		scroller.style.verticalAlign = 'middle';
		scroller.style.paddingTop = '5px';
		scroller.style.paddingBottom = '5px';
		scroller._type = 'preview';
		var src = scroller;
		this.src = src;
		this.scroller = new betterSlidingDiv(scroller, { fps: 20, speed: 10 * 8, points: 20, stopOnExit: true });

		//this.eventMouseMove = this.onMouseMove.bindAsEventListener(this);
		//Event.observe(this.scroller, 'mouseover', this.eventMouseMove, true);
		//Event.observe(this.scroller, 'mousemove', this.eventMouseMove, true);

		monitor = $(document.createElement('DIV'));
		this.monitor = monitor; 

		this.container.appendChild(monitor);

		// R�cup�re toutes les images du scroller et leur ajoute la fonction onClick.
		var images = src.select('img');
		this.eventThumbnailClick = this.onImageClick.bindAsEventListener(this);
		for (var i = 0; i < images.length; i++) {
			Event.observe(images[i], 'click',  this.eventThumbnailClick, true);
		}
	},

	onImageClick : function(e)
	{
		this.container.style.position = 'relative';
		// Cr�er un nouvel �l�ment contenant l'image + des fonctions + controle de fermeture et navigation.
		var invoker = Event.element(e);
		var invokerCopy = invoker.cloneNode(true);
		var old = null;
		popin = $(document.createElement('DIV'));	  	  
		if (this.popin == null)
			this.popin =  popin;
		else
			old   = this.popin;
		new Draggable(popin);

		monitor = $(document.createElement('DIV'));
		popin.appendChild(monitor);
		close = $(document.createElement('a'));
		close.innerHTML = 'close';
		this.eventCloseClick = this.closePopin.bindAsEventListener(this);
		Event.observe(close, 'click',  this.eventCloseClick, true);
		monitor.appendChild(close);

		popin.style.position = 'absolute';
		//popin.style.width = '250px';
		popin.style.display = 'none';
		popin.style.zIndex = '1000';
		popin.style.backgroundColor = '#EFEFEF';
		popin.style.top='-20px';

		popin.style.left = ( invoker.offsetLeft - this.src.scrollLeft - Math.ceil(invoker.getDimensions().width/2) )+'px';
		popin.appendChild(invokerCopy);
		invokerCopy.src = this.managedMedia[invoker.id].large;
		invokerCopy.id  = invoker.id;
		popin.style.position = 'absolute';

		// Creating the navtool.

		nav = $(document.createElement('DIV'));
		nav.style.textAlign= 'center';

		previous = $(document.createElement('a'));
		previous.innerHTML = 'Previous';
		this.eventPreviousClick = this.previousImage.bindAsEventListener(this);
		Event.observe(previous, 'click',  this.eventPreviousClick, true);

		zoom = $(document.createElement('a'));
		zoom.innerHTML = 'Zoom';
		zoom.href = 'Test';

		next = $(document.createElement('a'));
		next.innerHTML = 'Next';
		this.eventNextClick = this.nextImage.bindAsEventListener(this);
		Event.observe(next, 'click',  this.eventNextClick, true);


		nav.appendChild(previous);
		nav.appendChild(zoom);
		nav.appendChild(next);

		popin.appendChild(nav);
		this.container.appendChild(popin);
		if (null == old)
			new Effect.Parallel([
			                     new Effect.Appear(popin)
			                     ])

		if (null != old)
		{
			new Effect.Parallel([
			                     new Effect.Appear(popin),
			                     new Effect.Fade(old)
			                     ])
			//this.container.removeChild(old);
			this.popin = popin;
		}
		Event.stop(e);

	},

	onMouseMove: function(e)
	{

	},

	addMediaInfo: function(media, options)
	{
		if (this.managedMedia[media] == null )
		{
			this.managedMedia[media] = new Object();
		}
		this.managedMedia[media].id = media;
		this.managedMedia[media].large = options.large;

		this.orderedMedia.push(media);
	},

	previousImage : function(event)
	{
		// Si l'id n'est pas le premier du tableau.
		var currentId = this.popin.select('img')[0].id;
		if (this.orderedMedia.indexOf(currentId)>0)
		{
			prev = this.orderedMedia.indexOf(currentId) - 1 ;

			this.popin.select('img')[0].id = this.orderedMedia[prev];
			this.popin.select('img')[0].src = this.managedMedia[ this.orderedMedia[prev] ].large;
		}
	},

	nextImage: function(event){

		var currentId = this.popin.select('img')[0].id;
		if (this.orderedMedia.indexOf(currentId) < this.orderedMedia.size() - 1)
		{
			prev = this.orderedMedia.indexOf(currentId) + 1 ;

			this.popin.select('img')[0].id = this.orderedMedia[prev];
			this.popin.select('img')[0].src = this.managedMedia[ this.orderedMedia[prev] ].large;
		}
	},

	closePopin: function (event)
	{
		this.container.removeChild(this.popin);
		this.popin = null;
	}



}
);
 */
function findPosX(obj)
{
	var curleft = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft
			obj = obj.offsetParent;

		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}
function findPosY(obj)
{
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

/** * * AJAX IFRAME METHOD (AIM) * http://www.webtoolkit.info/ * **/ 
AIM = {

		frame : function(c) {

			var n = 'f' + Math.floor(Math.random() * 99999);
			var d = $(document.createElement('DIV'));
			d.innerHTML = '<iframe style="display:none" src="about:blank" id="'+n+'" name="'+n+'" onload="AIM.loaded(\''+n+'\')"></iframe>';
			document.body.appendChild(d);

			var i = document.getElementById(n);
			if (c && typeof(c.onComplete) == 'function') {
				i.onComplete = c.onComplete;
			}

			return n;
		},

		form : function(f, name) {
			f.setAttribute('target', name);
		},

		submit : function(f, c) {
			AIM.form(f, AIM.frame(c));
			if (c && typeof(c.onStart) == 'function') {
				return c.onStart();
			} else {
				return true;
			}
		},

		loaded : function(id) {
			var i = document.getElementById(id);
			if (i.contentDocument) {
				var d = i.contentDocument;
			} else if (i.contentWindow) {
				var d = i.contentWindow.document;
			} else {
				var d = window.frames[id].document;
			}
			if (d.location.href == "about:blank") {
				return;
			}

			if (typeof(i.onComplete) == 'function') {
				i.onComplete(d.body.innerHTML);
			}
		}

};

Nts = {};

/*
		require: function(libraryName) {
	// inserting via DOM fails in Safari 2.0, so brute force approach
	document.write('<script type="text/javascript" src="'+libraryName+'"><\/script>');
},
REQUIRED_PROTOTYPE: '1.6.0',

load: function() {
	function convertVersionString(versionString){
		var r = versionString.split('.');
		return parseInt(r[0])*100000 + parseInt(r[1])*1000 + parseInt(r[2]);
	}
	if((typeof Prototype=='undefined') || 
			(typeof Element == 'undefined') || 
			(typeof Element.Methods=='undefined') ||
			(convertVersionString(Prototype.Version) < 
					convertVersionString(Scriptaculous.REQUIRED_PROTOTYPE)))
		throw("Natysphere requires the Prototype JavaScript framework >= " +
				Scriptaculous.REQUIRED_PROTOTYPE);

	$A(document.getElementsByTagName("script")).findAll( function(s) {
		return (s.src && s.src.match(/natysphere\.js(\?.*)?$/))
	}).each( function(s) {
		var path = s.src.replace(/natysphere\.js(\?.*)?$/,'');
		var includes = s.src.match(/\?.*load=([a-z,]*)/);
		(includes ? includes[1] : 'utility,ui,newsletter-manager,account-manager,job-manager,vehicle-manager,content-manager,carpooling-manager').split(',').each(
				function(include) { Nts.require(path+'nts/natysphere-'+include+'.js') });
	});
}
};
Nts.Version = '0.1';
Nts.load();
 */

Nts.ImageManager = {

		url : '',
		entityId : '',
		imageWidget : '',

		prepareImageForm : function ()
		{

		},

		imageClick : function (event, element)
		{
			re = new RegExp("img_([0-9]+)","i");
			element = Event.element(event);
			elementId = re.exec(element.id)[1];
			entityId;
			$('imageWidget').style.position = 'absolute';
			$('imageWidget').style.zIndex = 100;
		}

};

Nts.ImageManager.bfx = Nts.ImageManager.imageClick.bindAsEventListener(Nts);

function xml2dom(text) {
	try //Internet Explorer
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(text);
	}
	catch(e)
	{
		try // Firefox, Mozilla, Opera, etc.
		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(text,"text/xml");
		}
		catch(e)
		{
			alert(e.message);
			return;
		}
	}
	return xmlDoc;
}

var Base64 = {

		// private property
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		// public method for encoding
		encode : function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			input = Base64._utf8_encode(input);

			while (i < input.length) {

				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

			}

			return output;
		},

		// public method for decoding
		decode : function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {

				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

			}

			output = Base64._utf8_decode(output);

			return output;

		},

		// private method for UTF-8 encoding
		_utf8_encode : function (string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		},

		// private method for UTF-8 decoding
		_utf8_decode : function (utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;

			while ( i < utftext.length ) {

				c = utftext.charCodeAt(i);

				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				}
				else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}

			}

			return string;
		}

}

Object.extend( Draggable, 
		{

		});

function gotoUrl(url){
	document.location = Base64.decode(url);
}

function decodeUrl(url, len){
	var url = Base64.decode(url);
	return url.substring(0, len);
}


/*
if( document.addEventListener ) document.addEventListener( 'DOMContentLoaded', WideForm, false );
 */




