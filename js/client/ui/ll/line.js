/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/ll/line";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/line.css");


    define(name, libs, function () {
        var lay = require("js/client/ui/lay");

        var line = lay.inherit({
            constructor: function line(_options) {
                var options = {
                    coords: [0, 0],
                    width: 0,
                    height: 0
                };
                Object.extend(options, _options);


                this.__x1 = 0;
                this.__y1 = 0;
                this.__x2 = 0;
                this.__y2 = 0;

                this.__size_x = 12000;
                this.__size_y = 12000;
                lay.prototype.constructor.call(this, options);
                this._init();
            },

            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");
                this.__init_marker();
                this.__init_line();
                this.__events();
            },

            __init_marker: function () {
                var el = this.__el = document.createElement("div");

                this.__svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this.__el.appendChild(this.__svg);

                this.__icon = new L.DomMarkers.icon({
                    element: el,
                    iconSize: [this._opts.width, this._opts.height],
                    className: "ll-line"
                });

                this.__marker = L.marker(this._opts.coords, {
                    "icon": this.__icon
                });
                this.__svg.setAttribute("viewBox", "0 0 " + this.__size_x + " " + this.__size_y);


                //
                //this.__svg.style.overflow = "initial";
                this.__svg.style.width = this.__size_x + "px";
                this.__svg.style.height = this.__size_y + "px";
                this.__svg.style.position = "relative";
                this.__svg.style.left = -(this.__size_x / 2) + "px";
                this.__svg.style.top = -(this.__size_y / 2) + "px";
            },

            __init_line: function () {
                this.__line = document.createElementNS("http://www.w3.org/2000/svg", "line")
                this.__line.setAttribute("x1", 0);
                this.__line.setAttribute("y1", 0);
                this.__line.setAttribute("x2", 0);
                this.__line.setAttribute("y2", 0);
                this.__line.setAttribute("stroke-width", "2");
                this.__line.setAttribute("stroke", "rgb(255,0,0)");

                this.__svg.appendChild(this.__line);
            },

            __events: function () {
                //this.__el.addEventListener("mousedown", function (_event) {
                //    this.trigger("mousedown", _event);
                //}.bind(this));
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
            },

            set_start: function (x, y) {
                this.__line.setAttribute("x1", x + this.__size_x / 2);
                this.__line.setAttribute("y1", y + this.__size_y / 2);
                this.__x1 = x;
                this.__y1 = y;
                this.__calc_icon();
            },

            set_end: function (x, y) {
                this.__line.setAttribute("x2", x + this.__size_x / 2);
                this.__line.setAttribute("y2", y + this.__size_y / 2);
                this.__x2 = x;
                this.__y2 = y;
                this.__calc_icon();
            },

            left_top: function () {

            },

            right_bottom: function () {

            },
            
            __calc_icon: function () {
                ////debugger;
                //var min_x = Math.min(this.__x1, this.__x2);
                //var min_y = Math.min(this.__y1, this.__y2);
                //
                //var max_x = Math.max(this.__x1, this.__x2);
                //var max_y = Math.max(this.__y1, this.__y2);

                //this.__marker.setLatLng(new L.latLng(min_x, min_y))

            }
        });

        return line;
    })
})(window);