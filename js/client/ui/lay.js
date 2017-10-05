/**
 * Created by Cubla on 20.08.2017.
 */
(function (_export) {
    var name = "js/client/ui/lay";
    var libs = [
        "js/basic"
    ];

    load_css("css/lay.css");

    define(name, libs, function () {
        var basic = require("js/basic");
        var id = 0;

        var lay = basic.inherit({
            constructor: function lay(_options) {
                var options = {
                    elem_type: "div"
                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },

            destructor: function () {
                for(var k in this.__listeners){
                    this.remove_event(k);
                }
            },

            _init: function () {
                this._wrapper = document.createElement(this._opts.elem_type);
                this.add_class("ui-lay");
                this.__listeners = {};
            },

            css: function (_key, _value) {
                if(_value === undefined) {
                    if (_key.toString() == "[object Object]") {
                        for (var k in _key) {
                            if (_key.hasOwnProperty(k)) {
                                this._wrapper.style[k] = _key[k];
                            }
                        }
                    } else {
                        return this._wrapper.style[_key];
                    }
                }

                this._wrapper.style[_key] = _value;
            },

            add_class: function (_class_name) {
                var classes = this._wrapper.getAttribute("class") || " ";
                var cls_arr = classes.split(" ");
                cls_arr.unshift(_class_name);
                var res = cls_arr.join(" ");
                this._wrapper.setAttribute("class", res);
            },

            remove_class: function (_class_name) {
                var classes = this._wrapper.getAttribute("class");
                if (classes == undefined) {
                    return;
                }
                var cls_arr = classes.split(" ");
                cls_arr.splice(cls_arr.indexOf(_class_name), 1);
                var res = cls_arr.join(" ");
                this._wrapper.setAttribute("class", res);
            },

            attrs: function (_key, _value) {
                if(_value === undefined){
                    if (_key.toString() == "[object Object]") {
                        for (var k in _key) {
                            if (_key.hasOwnProperty(k)) {
                                this._wrapper.setAttribute(k, _key[k]);
                            }
                        }
                    } else {
                        return this._wrapper.getAttribute(_key);
                    }
                    return;
                }
                this._wrapper.setAttribute(_key, _value);
            },

            append: function (_lay) {
                this._wrapper.appendChild(_lay.wrapper());
            },

            wrapper: function(){
                return this._wrapper;
            },

            add_event: function (_type, _callback) {
                var lid = id++;
                this.__listeners[lid] = {
                    type: _type, callback: _callback
                };
                this._wrapper.addEventListener(_type, _callback);

                return lid;
            },

            remove_event: function (_lid) {
                var data = this.__listeners[_lid];
                this._wrapper.removeEventListener(data.type, data.callback);
                delete this.__listeners[_lid];
            }
        });

        return lay;
    })
})(window);