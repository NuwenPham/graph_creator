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
                    font_size: 15,
                    height: 40,
                    has_bonus: false,
                    bonus_ui: {
                        background: "#f0a",
                        width: 10,
                        height: 10,
                        margin: 4
                    },
                    text: ""
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
                var el = this.__el = this._wrapper = document.createElement("div");
                el.setAttribute("class", "my-div-icon");

                this.__icon = new L.DomMarkers.icon({
                    element : el,
                    iconSize: [this._opts.width, this._opts.height],
                    className: "my-div-icon"
                });

                this.__marker = L.marker(this._opts.coords, {
                    "icon": this.__icon
                });

                // this.__el.innerText = "sadf";
                this.__el.style.fontSize = this._opts.font_size + "px";
                this.__el.title = "C5 / J144420";

                this.__head();
            },

            __head: function () {
                if(this._opts.has_bonus) {
                    this.__head_el_bonus = document.createElement("div");
                    this.__el.appendChild(this.__head_el_bonus);
                    this.__head_el_bonus.setAttribute("class", "my-div-icon-head-left");
                }

                this.__head_el_right = document.createElement("div");
                this.__el.appendChild(this.__head_el_right);
                this.__head_el_right.setAttribute("class", "my-div-icon-head-right");
                this.__head_el_right.innerText = this._opts.text;
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