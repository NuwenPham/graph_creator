/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var name = "js/basic";
    var libs = [
        "js/baseClass"
    ];
    define( name, libs, function(){

        return Base.inherit({

            constructor: function(_opt){
                this._opts = Object.extend({

                }, _opt);

                this._events = [];
            },

            on: function (_eventName, _callback, _context) {
                if (_eventName == undefined || _callback == undefined)
                    return false;

                if (typeof(_callback) != "function" || typeof(_eventName) != "string" || _eventName == "")
                    return false;

                var lEvent = {
                    name: _eventName,
                    callback: _callback,
                    context: _context || null
                };
                this._events.push(lEvent);
                return true;
            },

            off: function (_eventName, _callback) {
                var a = 0;
                if (_eventName == undefined)
                    this._events = [];

                while (a < this._events.length) {
                    if (this._events[a].name == _eventName) {
                        if (_callback != undefined) {
                            if (this._events[a].callback == _callback) {
                                this._events.splice(a, 1);
                            }
                        } else {
                            this._events.splice(a, 1);
                        }
                    }
                    a++;
                }
            },

            trigger: function (_eventName, _params) {
                var a = 0;
                if (this._events) {
                    while (a < this._events.length) {
                        if (this._events[a].name == _eventName)
                            if (_params != undefined) {
                                if (this._events[a].context != undefined) {
                                    return this._events[a].callback.call(this._events[a].context, _params);
                                } else {
                                    return this._events[a].callback.call(this, _params);
                                }
                            } else {
                                return this._events[a].callback.call(this);
                            }
                        a++;
                    }
                }
            }

        });
    });
})(window);