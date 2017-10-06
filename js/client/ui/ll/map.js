/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/ll/map";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/map.css");

    var m_counter = 0;

    define(name, libs, function () {
        var lay = require("js/client/ui/lay");

        var map = lay.inherit({
            constructor: function map(_options) {
                var options = {};
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this.__markers = {};
                this._init();
            },

            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");

                this.__actions = {
                    __on_marker_move: this.__on_marker_move.bind(this),
                    __on_marker_up: this.__on_marker_up.bind(this)
                };

                this.__init_leaflet();
            },

            __init_leaflet: function () {
                this._wrapper = document.createElement("div");


                var myCRS = L.Util.extend({}, L.CRS, {
                    "projection": {
                        "project": function (_latlng) {
                            return new L.Point(_latlng.lat, _latlng.lng);
                        },
                        "unproject": function (_point) {
                            return new L.LatLng(_point.x, _point.y, true);
                        }
                    },
                    "transformation": new L.Transformation(1, 0, 1, 0),
                    "scale": function (_event) {
                        return Math.pow(2, (_event - 10) / 2);
                    }
                });

                this.__leaflet_map = L.map(this._wrapper, {
                    "dragging": true,
                    "keyboard": false,
                    "zoomControl": false,
                    "attributionControl": false,
                    "closePopupOnClick": false,
                    "doubleClickZoom": false,
                    "scrollWheelZoom": true,
                    "touchZoom": false,
                    "boxZoom": false,
                    "trackResize": false,
                    "center": [-950, -450],
                    "zoom": 10,
                    "minZoom": 0,
                    "maxZoom": 10,
                    "zoomAnimation": false,
                    "crs": myCRS
                });

                this._wrapper.style.width = "100%";
                this._wrapper.style.height = "100%";

                this.__leaflet_map.on("viewreset", this.__on_map_zoom.bind(this));
            },

            lm: function () {
                return this.__leaflet_map;
            },

            add_marker: function (_marker) {
                var mid = m_counter++;
                this.lm().addLayer(_marker.marker());
                this.__markers[mid] = {
                    instance: _marker,
                    mousedown: this.__on_marker_down.bind(this, mid)
                };

                if(_marker.is_movable()) {
                    _marker.on("mousedown", this.__markers[mid].mousedown);
                }

                return mid;
            },

            remove_marker: function (_mid) {
                var marker = this.__markers[_mid];
                if(marker){
                    if(this.__current_marker == marker.instance){
                        // снять обработчики
                        window.removeEventListener("mousemove", this.__actions.__on_marker_move);
                        window.removeEventListener("mouseup", this.__actions.__on_marker_up);
                    }
                    marker.instance.off("mousedown", marker.mousedown);
                }
                this.lm().removeLayer(marker.instance.marker());
                delete this.__markers[_mid];
            },

            markers: function () {
                return this.__markers;
            },

            __on_marker_down: function (_mid, _event) {
                var marker = this.__markers[_mid].instance;

                if(!this.__current_marker) {

                    if(_event.ctrlKey && _event.altKey){
                        this.remove_marker(_mid);
                        _event.stopPropagation();
                        return;
                    }

                    if(_event.ctrlKey){
                        // debugger;
                        _event.stopPropagation();
                        return;
                    }
                    this.__current_marker = marker;
                    var _mrk = marker.marker();
                    var _map = this.lm();
                    _map.dragging.disable();
                    this.__start_mouse_coords = new L.Point(_event.clientX, _event.clientY);
                    this.__start_marker_point = _map.latLngToLayerPoint(_mrk._latlng);
                    window.addEventListener("mousemove", this.__actions.__on_marker_move);
                    window.addEventListener("mouseup", this.__actions.__on_marker_up);
                }

            },

            __on_marker_move: function (_event) {
                if(this.__current_marker) {
                    var _marker = this.__current_marker.marker();
                    var _map = this.lm();
                    var mouse_coords = new L.Point(_event.clientX, _event.clientY);
                    var diff = mouse_coords.subtract(this.__start_mouse_coords);
                    var res = this.__start_marker_point.add(diff);
                    var latlon = _map.layerPointToLatLng(res);
                    _marker.setLatLng(latlon);
                }
            },

            __on_marker_up: function (_event) {
                if(this.__current_marker) {
                    window.removeEventListener("mousemove", this.__actions.__on_marker_move);
                    window.removeEventListener("mouseup", this.__actions.__on_marker_up);
                    this.lm().dragging.enable();
                    this.__current_marker = null;
                }
            },

            __on_map_zoom: function (_event) {
                var markers = this.markers();
                var ratio = Math.pow(2, (_event.target._zoom - 10) / 2);

                for(var k in markers){
                    var mrk = markers[k].instance;
                    var el = mrk.dom();
                    var width = mrk._opts.width * ratio;
                    var height = mrk._opts.height * ratio;
                    el.style.width = width + "px";
                    el.style.height = height + "px";
                }
            }

        });

        return map;
    })
})(window);