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
                this.__actions = {
                    __on_map_move: this.__on_map_move.bind(this),
                    __on_map_up: this.__on_map_up.bind(this)
                }
            },

            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
                this.__wrapper.style.height = "100%";
            },

            __init_map: function () {
                this.__map = new map();
                this.__wrapper.appendChild(this.__map.wrapper());

                this.__map.map().on("viewreset", this.__on_map_zoom.bind(this));
                // this.__map.map().on("zoomend", this.__on_map_zoom.bind(this));

                var m1 = new marker({
                    coords: [200,50]
                });
                this.__map.add_marker(m1);


                var m2 = new marker();
                this.__map.add_marker(m2);

                m1.on("mousedown", this.__on_marker_down.bind(this, m1));
                m2.on("mousedown", this.__on_marker_down.bind(this, m2));
            },

            __on_marker_down: function (_marker, _event) {
                if(!this.__current_marker) {
                    this.__current_marker = _marker;
                    var _mrk = _marker.marker();
                    var _map = this.__map.map();
                    _map.dragging.disable();
                    this.__start_mouse_coords = new L.Point(_event.clientX, _event.clientY);
                    this.__start_marker_point = _map.latLngToLayerPoint(_mrk._latlng);
                    this.__wrapper.addEventListener("mousemove", this.__actions.__on_map_move);
                    this.__wrapper.addEventListener("mouseup", this.__actions.__on_map_up);
                }
            },

            __on_map_move: function (_event) {
                if(this.__current_marker) {
                    var _marker = this.__current_marker.marker();
                    var _map = this.__map.map();
                    var mouse_coords = new L.Point(_event.clientX, _event.clientY);
                    var diff = mouse_coords.subtract(this.__start_mouse_coords);
                    var res = this.__start_marker_point.add(diff);
                    var latlon = _map.layerPointToLatLng(res);
                    _marker.setLatLng(latlon);
                }
            },

            __on_map_up: function (_event) {
                if(this.__current_marker) {
                    this.__wrapper.removeEventListener("mousemove", this.__actions.__on_map_move);
                    this.__wrapper.removeEventListener("mouseup", this.__actions.__on_map_up);
                    this.__map.map().dragging.enable();
                    this.__current_marker = null;
                }
            },

            __on_map_zoom: function (_event) {
                var markers = this.__map.markers();
                var ratio = Math.pow(2, (_event.target._zoom - 10) / 2);

                var a = 0;
                while (a < markers.length) {
                    var mrk = markers[a];
                    var el = mrk.dom();
                    var width = mrk._opts.width * ratio;
                    var height = mrk._opts.height * ratio;
                    el.style.width = width + "px";
                    el.style.height = height + "px";
                    a++;
                }
            },

            wrapper: function(){
                return this.__wrapper;
            }
        });

        return graph_editor;
    })
})(window);