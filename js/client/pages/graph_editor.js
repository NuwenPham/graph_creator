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

            afterInsert: function () {
                // this.__wrapper.style.height = "100%";
            },

            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
                this.__wrapper.style.height = "100%";

                window.addEventListener("mousedown", function (_event) {
                    if(_event.ctrlKey) {
                        this.__map.__leaflet_map.invalidateSize();
                        var p = this.__map.__leaflet_map.getBounds();
                        var center = p.getCenter();
                        this.__styles = getComputedStyle(this.__wrapper);
                        var width = parseInt(this.__styles.width) / 2;
                        var height = parseInt(this.__styles.height) / 2;
                        var ratio_1 = Math.pow(2, (this.__map.__leaflet_map._zoom - 10) / 2);
                        var ratio_2 = Math.pow(2, (10 - this.__map.__leaflet_map._zoom ) / 2);

                        var marker_offset_x = (100 / 2) * ratio_1;
                        var marker_offset_y = (40 / 2) * ratio_1;

                        var x = (_event.clientX - width - marker_offset_x) * ratio_2;
                        var y = (_event.clientY - height - marker_offset_y) * ratio_2;
                        var res_x  = center.lat + x;
                        var res_y  = center.lng + y;


                        var rnd = Math.random() > 0.5;
                        var m = new marker({
                            coords: [res_x, res_y],
                            movable: true,
                            has_bonus: true,
                            text: rnd > 0.5 ? "J144420" : "5ZXX-0"
                        });
                        this.__map.add_marker(m);
                    }
                }.bind(this))
            },

            __init_map: function () {
                this.__map = new map();
                this.__wrapper.appendChild(this.__map.wrapper());
            },

            wrapper: function(){
                return this.__wrapper;
            }
        });

        return graph_editor;
    })
})(window);