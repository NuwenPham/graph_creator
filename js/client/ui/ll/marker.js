/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/ll/marker";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/marker.css");


    define(name, libs, function () {
        var lay = require("js/client/ui/lay");

        var marker = lay.inherit({
            constructor: function marker(_options) {
                var options = {
                    coords: [2, 2],
                    width: 100,
                    height: 40
                };
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this._init();
            },

            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");
                this.__init_marker();
                this.__events();
            },

            __init_marker: function () {
                var el = this.__el = document.createElement("div");
                el.setAttribute("class", "my-div-icon");

                this.__icon = new L.DomMarkers.icon({
                    element : el,
                    iconSize: [this._opts.width, this._opts.height],
                    className: "my-div-icon",

                });

                this.__marker = L.marker(this._opts.coords, {
                    "icon": this.__icon
                });

            },

            __events: function () {
                this.__el.addEventListener("mousedown", function (_event) {
                    this.trigger("mousedown", _event);
                }.bind(this));
            },

            marker: function () {
                return this.__marker;
            },

            icon: function () {
                return this.__icon;
            },

            dom: function () {
                return this.__el;
            },

            is_movable: function () {
                return this._opts.movable;
            }
        });

        return marker;
    })
})(window);