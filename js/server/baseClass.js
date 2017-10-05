/**
 * Created by pham on 15.06.15.
 */

var window = global.window = Object.create(null);

var cl = function () {
};

cl.inherit = function (proto) {
	var that = this;
	var lBase = function () {
	};
	var lMember, lFn, lSubclass;

	lSubclass = proto && proto.init || proto.constructor ? proto.init || proto.constructor : function () {
		that.apply(this, arguments);
	};

	lBase.prototype = that.prototype;
	lFn = lSubclass.fn = lSubclass.prototype = new lBase();

	for (lMember in proto) {
		if (typeof proto[lMember] === "object" && !(proto[lMember] instanceof Array) && proto[lMember] !== undefined) {
			// Merge object members
			lFn[lMember] = Object.extend(true, {}, lBase.prototype[lMember], proto[lMember]);
		} else {
			lFn[lMember] = proto[lMember];
		}
	}

	for (var method in that) {
		if (that.hasOwnProperty(method) && that[method] instanceof Function) {
			lSubclass[method] = that[method]
		}
	}

	lFn.constructor = lSubclass;
	lSubclass.inherit = that.inherit;

	return lSubclass;
};

window.Base = cl.inherit({
	"constructor": function () {
		var that = this;

		if (!(that instanceof cl)) {
			throw new SyntaxError("Didn't call \"new\" operator");
		}

		cl.call(that);
		that.uncyclic = [];
	},
	"destructor": function () {
		var that = this;
		var lIndex, lKey;

		for (lIndex = 0; lIndex < that.uncyclic.length; ++lIndex) {
			that.uncyclic[lIndex].call();
		}

		for (lKey in that) {
			if (that.hasOwnProperty(lKey)) {
				that[lKey] = undefined;
				delete that[lKey];
			}
		}
	}
});



Object.extend = function () {
	var lTarget = arguments[0] || {};
	var lIndex = 1;
	var lLength = arguments.length;
	var lDeep = false;
	var lOptions, lName, lSrc, lCopy, lCopyIsArray, lClone;

	if (typeof lTarget === "boolean") {
		lDeep = lTarget;
		lTarget = arguments[1] || {};
		lIndex = 2;
	}

	if (typeof lTarget !== "object" && typeof lTarget != "function") {
		lTarget = {};
	}

	if (lLength === lIndex) {
		lTarget = this;
		--lIndex;
	}

	for (; lIndex < lLength; lIndex++) {
		if ((lOptions = arguments[lIndex]) != undefined) {
			for (lName in lOptions) {
				lSrc = lTarget[lName];
				lCopy = lOptions[lName];

				if (lTarget === lCopy) {
					continue;
				}

				if (lDeep && lCopy && (Object.isObject(lCopy) || (lCopyIsArray = Array.isArray(lCopy)))) {
					if (lCopyIsArray) {
						lCopyIsArray = false;
						lClone = lSrc && Array.isArray(lSrc) ? lSrc : [];

					} else {
						lClone = lSrc && Object.isObject(lSrc) ? lSrc : {};
					}

					lTarget[lName] = Object.extend(lDeep, lClone, lCopy);

					// Don't bring in undefined values
				} else {
					if (lCopy !== undefined) {
						lTarget[lName] = lCopy;
					}
				}
			}
		}
	}
	return lTarget;
};

Array.prototype.merge = function(_mergedArr) {
	var a = 0;
	if ( _mergedArr == undefined ) return this;
	while ( a < _mergedArr.length ) {
		this.push(_mergedArr[a]);
		a++;
	}
};

var print_r = function(_object, _options) {
	var lKey, lSpaces = "   ", lSpacesLevel = "", lSpacesPreLevel = "";
	var lDeepnes = "", lType = "", lView = "";

	if ( _options == undefined ) {
		_options = {
			level : 1,
			isStop : false,
			maxLevel : 4,
			isShowDeepnes : false,
			isShowType : true
		}
	} else {
		_options.level++;
	}

	if ( _options.level == _options.maxLevel )
		_options.isStop = true;

	var a = 0;
	while ( a++ < _options.level )
		lSpacesLevel += lSpaces;

	a = 0;
	while ( a++ < _options.level - 1 )
		lSpacesPreLevel += lSpaces;

	if ( _object == undefined ) {
		console.log(lSpacesPreLevel + "{");
		console.log(lSpacesLevel);
		console.log(lSpacesPreLevel + "}");
		_options.isStop = false;
		_options.level--;
		return;
	}

	console.log(lSpacesPreLevel + "{");
	for ( lKey in _object ) {
		if ( typeof _object[lKey] == "object" ) {

			if ( _options.isShowDeepnes )
				lDeepnes = "(deepnes: " + _options.level + ") ";

			if ( _options.isShowType )
				lType = "[" + typeof _object[lKey] + "] ";

			lView = "\"" + lKey + "\" : ";

			if ( _object[lKey] == undefined ) {
				lView += "undefined,";
				console.log(lSpacesLevel + lDeepnes + lType + lView);
			} else {
				console.log(lSpacesLevel + lDeepnes + lType + lView + (_options.isStop ? "{ ... }" : ""));
				if ( !_options.isStop ) {
					print_r(_object[lKey], _options)
				}

			}
		} else {
			if ( typeof _object[lKey] == "function" ) {
				lType = "";

				if ( _options.isShowType )
					lType = "[" + typeof _object[lKey] + "] ";

				console.log(lSpacesLevel + lType + lKey + " : function(){ ... }");
			} else {
				lType = "";
				lView = "";

				if ( _options.isShowType )
					lType = "[" + typeof _object[lKey] + "] ";

				lView = "\"" + lKey + "\" : " + (_object[lKey] ? _object[lKey] : "undefined") + ",";

				console.log(lSpacesLevel + lType + lView);
			}
		}
	}
	console.log(lSpacesPreLevel + "},");
	_options.isStop = false;
	_options.level--;
};

Object.cookie = function(name, value, options) {

	if (value === undefined) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	options = options || {};

	var expires = options.expires;

	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;

	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
};

Object.cookieRemove = function (name) {
	Object.cookie(name, "", {
		expires: -1
	})
};