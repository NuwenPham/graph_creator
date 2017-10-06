/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/graph_editor";
    var libs = [
        "js/basic",
        "js/client/ui/ll/map",
        "js/client/ui/ll/marker"
    ];

    load_css("css/graph_editor.css");

    define(name, libs, function () {
        var basic = require("js/basic");

        var map = require("js/client/ui/ll/map");
        var marker = require("js/client/ui/ll/marker");

        var graph_editor = basic.inherit({
            constructor: function graph_editor(_options) {
                var options = {

                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },

            destructor: function () {
                basic.prototype.destructor.call(this);
            },

            _init: function () {
                this.__init_wrapper();
                this.__init_map();

            },

            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
                this.__wrapper.style.height = "100%";

                window.addEventListener("mousedown", function (_event) {
                    if(_event.ctrlKey) {
                        // debugger;
                        // console.log(this.__map.__leaflet_map.getBounds());
                        var p = this.__map.__leaflet_map.getBounds();
                        // this.__map.__leaflet_map._zoom
                        // debugger;
                        var ratio = Math.pow(2, (this.__map.__leaflet_map._zoom - 10) / 2);

                        var m = new marker({
                            coords: [_event.clientX + p._southWest.lat, _event.clientY + p._southWest.lng],
                            movable: true
                        });
                        this.__map.add_marker(m);
                    }
                }.bind(this))
            },

            __init_map: function () {
                // debugger;
                this.__map = new map();
                this.__wrapper.appendChild(this.__map.wrapper());
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

        return graph_editor;
    })
})(window);