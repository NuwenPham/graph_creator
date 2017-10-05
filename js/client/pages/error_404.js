/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/error_404";
    var libs = [
        "js/basic"
    ];

    define(name, libs, function () {
        var basic = require("js/basic");


        var error_404 = basic.inherit({
            constructor: function error_404(_options) {
                var options = {

                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },

            _init: function () {
                this._wrapper = document.createElement("div");
                this._wrapper.style.width = "100%";
                this._wrapper.style.height = "100%";
                this._wrapper.style.background = "#aaa";
                this._wrapper.style.color = "#000";
                this._wrapper.innerHTML = "ERROR PAGE";
            },

            wrapper: function(){
                return this._wrapper;
            }
        });

        return error_404;
    })
})(window);