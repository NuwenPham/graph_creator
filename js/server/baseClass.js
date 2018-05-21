/**
 * Created by pham on 15.06.15.
 */

var window = global.window = Object.create(null);

var common_class = function () {};
common_class.inherit = function (_class) {
	var that = this;
	var base = function () {};
	var newclass = _class && _class.constructor ? _class.constructor : function () {
		that.apply(this, arguments);
	};

	base.prototype = this.prototype;
	var fn = newclass.prototype = new base();

	for (var k in _class) {
		if (typeof _class[k] === "object" && !(_class[k] instanceof Array) && _class[k] !== undefined) {
			fn[k] = Object.extend(true, {}, base.prototype[k], _class[k]);
		} else {
			fn[k] = _class[k];
		}
	}

	for (var method in this) {
		if (this.hasOwnProperty(method) && this[method] instanceof Function) {
			newclass[method] = this[method]
		}
	}

	fn.constructor = newclass;
	newclass.inherit = this.inherit;
	return newclass;
};

global.Base = common_class.inherit({
	constructor: function () {
		if (!(this instanceof common_class)) {
			throw new Error("new not found");
		}
		common_class.call(this);
		this.uncyclic = [];
	},
	destructor: function () {
		for (var i = 0; i < this.uncyclic.length; ++i) {
			this.uncyclic[i].call();
		}
		for (var k in this) {
			if (this.hasOwnProperty(k)) {
				this[k] = undefined;
				delete this[k];
			}
		}
	}
});

Object.extend = function () {
	var target = arguments[0] || {};
	var index = 1;
	var length = arguments.length;
	var deep = false;

	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		index = 2;
	}

	if (typeof target !== "object" && typeof target != "function") {
		target = {};
	}

	if (length === index) {
		target = this;
		--index;
	}

	var options, src, copy, is_arr, clone;
	for (; index < length; index++) {
		if ((options = arguments[index]) != undefined) {
			for (var name in options) {
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (deep && copy && (Object.isObject(copy) || (is_arr = Array.isArray(copy)))) {
					if (is_arr) {
						is_arr = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && Object.isObject(src) ? src : {};
					}

					target[name] = Object.extend(deep, clone, copy);
				} else {
					if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
	}
	return target;
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


window.load_css = function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
};