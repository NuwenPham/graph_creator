/**
 * Created by Cubla on 20.08.2017.
 */
(function (_export) {
    var name = "js/client/ui/lay";
    var libs = [
        "js/client/ui/ui"
    ];

    load_css("css/lay.css");

    define(name, libs, function () {
        var ui = require("js/client/ui/ui");
        var id = 0;

        var lay = ui.inherit({
            constructor: function lay(_options) {
                var options = {
                    elem_type: "div"
                };
                Object.extend(options, _options);
                ui.prototype.constructor.call(this, options);
                this._init();
            },

            destructor: function () {
                for(var k in this.__listeners){
                    this.remove_event(k);
                }
            },

            _init: function () {
                this.__wrapper = document.createElement(this._opts.elem_type);
                this.add_class("ui-lay");
                this.__listeners = {};
            },

            css: function (_key, _value) {
                if(_value === undefined) {
                    if (_key.toString() == "[object Object]") {
                        for (var k in _key) {
                            if (_key.hasOwnProperty(k)) {
                                this.__wrapper.style[k] = _key[k];
                            }
                        }
                    } else {
                        return this.__wrapper.style[_key];
                    }
                }

                this.__wrapper.style[_key] = _value;
            },

            add_class: function (_class_name) {
                var classes = this.__wrapper.getAttribute("class") || " ";
                var cls_arr = classes.split(" ");
                cls_arr.unshift(_class_name);
                var res = cls_arr.join(" ");
                this.__wrapper.setAttribute("class", res);
            },

            remove_class: function (_class_name) {
                var classes = this.__wrapper.getAttribute("class");
                if (classes == undefined) {
                    return;
                }
                var cls_arr = classes.split(" ");
                cls_arr.splice(cls_arr.indexOf(_class_name), 1);
                var res = cls_arr.join(" ");
                this.__wrapper.setAttribute("class", res);
            },

            attrs: function (_key, _value) {
                if(_value === undefined){
                    if (_key.toString() == "[object Object]") {
                        for (var k in _key) {
                            if (_key.hasOwnProperty(k)) {
                                this.__wrapper.setAttribute(k, _key[k]);
                            }
                        }
                    } else {
                        return this.__wrapper.getAttribute(_key);
                    }
                    return;
                }
                this.__wrapper.setAttribute(_key, _value);
            },

            append: function (_lay) {
                this.__wrapper.appendChild(_lay.wrapper());
                this.add_child(_lay);
            },

            remove: function (_lay) {
                this.__wrapper.removeChild(_lay.wrapper());
                this.remove_child(_lay);
            },

            wrapper: function(){
                return this.__wrapper;
            },

            add_event: function (_type, _callback) {
                var lid = id++;
                this.__listeners[lid] = {
                    type: _type, callback: _callback
                };
                this.__wrapper.addEventListener(_type, _callback, false);

                return lid;
            },

            remove_event: function (_lid) {
                var data = this.__listeners[_lid];
                this.__wrapper.removeEventListener(data.type, data.callback);
                delete this.__listeners[_lid];
            },

            value: function () {
                return this.__wrapper.value;
            },

            inner_text: function(_text){
                this.__wrapper.innerText = _text;
            }
        });

        return lay;
    })
})(window);