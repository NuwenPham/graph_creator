/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/ll/map";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/map.css");


    define(name, libs, function () {
        var lay = require("js/client/ui/lay");

        var map = lay.inherit({
            constructor: function map(_options) {
                var options = {};
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this.__markers = [];
                this._init();
            },

            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");
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
            },

            map: function () {
                return this.__leaflet_map;
            },

            add_marker: function (_marker) {
                this.map().addLayer(_marker.marker());
                // .addTo(this.map());

                this.__markers.push(_marker);
            },

            markers: function () {
                return this.__markers;
            }

        });

        return map;
    })
})(window);