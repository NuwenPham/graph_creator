/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/error_page";
    var libs = [
        "js/basic",
        "js/client/ui/ll/map",
        "js/client/ui/ll/marker"
    ];
    // load_css("css/error_page.css");

    define(name, libs, function () {
        var basic = require("js/basic");
        var map = require("js/client/ui/ll/map");
        var marker = require("js/client/ui/ll/marker");

        var error_page = basic.inherit({
            constructor: function error_page(_options) {
                var options = {};
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },
            destructor: function () {
                basic.prototype.destructor.call(this);
            },
            _init: function () {
                // this.__init_wrapper();
                // this.__init_map();
            },
            __init_wrapper: function () {
                // this.__wrapper = document.createElement("div");
                // this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
                // this.__wrapper.style.height = "100%";
            },
            __init_map: function () {
                // this.__map = new map();
                // this.__wrapper.appendChild(this.__map.wrapper());
                //
                // var m1 = new marker({
                //     coords: [200,50],
                //     movable: true
                // });
                // this.__map.add_marker(m1);
                //
                // var m2 = new marker({
                //     movable: true
                // });
                // this.__map.add_marker(m2);
            },
            wrapper: function(){
                return this.__wrapper;
            }
        });

        return error_page;
    })
})(window);