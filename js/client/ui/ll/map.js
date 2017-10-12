/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/ll/map";
    var libs = [
        "js/client/ui/lay",
        "js/client/ui/ll/line"
    ];

    load_css("css/map.css");

    var m_counter = 2;
    var l_counter = 2;

    define(name, libs, function () {
        var lay = require("js/client/ui/lay");
        var link = require("js/client/ui/ll/line");


        var map = lay.inherit({
            constructor: function map(_options) {
                var options = {};
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this.__markers = {};
                this.__links = {};
                this.__attach_collection = {};
                this._init();
            },

            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");

                this.__actions = {
                    __on_marker_move: this.__on_marker_move.bind(this),
                    __on_marker_up: this.__on_marker_up.bind(this)
                };

                this._wrapper = document.createElement("div");
                this._wrapper.setAttribute("class", "ll-map");

                this.__init_back();

                this.__init_leaflet();
            },

            __init_leaflet: function () {





                this.__front = document.createElement("div");
                this.__front.setAttribute("class", "ll-map-front");
                this._wrapper.appendChild(this.__front);


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

                this.__leaflet_map = L.map(this.__front, {
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

            __init_back: function () {
                this.__back = document.createElement("div");
                this.__back.setAttribute("class", "ll-map-back");
                this._wrapper.appendChild(this.__back);

                this.__svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this.__back.appendChild(this.__svg);
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


                var ratio = Math.pow(2, (this.__leaflet_map._zoom - 10) / 2);
                var width = _marker._opts.width * ratio;
                var height = _marker._opts.height * ratio;
                _marker.dom().style.width = width + "px";
                _marker.dom().style.height = height + "px";

                return mid;
            },

            add_link: function (_link) {
                var lid = l_counter++;
                this.lm().addLayer(_link.marker());
                this.__links[lid] = {
                    instance: _link
                };
                return lid;
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
                this.lm().dragging.disable();

                if(!this.__current_marker) {

                    if(_event.ctrlKey && _event.altKey){
                        this.remove_marker(_mid);
                        _event.stopPropagation();
                        return;
                    }

                    if(_event.ctrlKey){
                         //debugger;
                        this.create_link(_mid);
                        _event.stopPropagation();
                        return;
                    }
                    this.__current_marker = _mid;
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
                    var _marker = this.get_marker(this.__current_marker).instance.marker();
                    var _map = this.lm();
                    var mouse_coords = new L.Point(_event.clientX, _event.clientY);
                    var diff = mouse_coords.subtract(this.__start_mouse_coords);
                    var res = this.__start_marker_point.add(diff);
                    var latlon = _map.layerPointToLatLng(res);
                    _marker.setLatLng(latlon);

                    this.update_links();
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

                //this.update_links();
            },

            create_link: function (_mid) {
                var l = new link();
                var lid = this.add_link(l);

                //debugger;
                this.attach_link_to(lid, _mid, true);
                this.attach_link_to(lid, _mid - 1, false);

            },

            attach_link_to : function (_lid, _mid, _is_start) {
                if(!this.__attach_collection[_mid]){
                    this.__attach_collection[_mid] = [];
                }
                this.__attach_collection[_mid].push({lid:_lid, is_start: _is_start});
            },

            get_marker: function (_mid) {
                return this.__markers[_mid];
            },

            get_link: function (_lid) {
                return this.__links[_lid];
            },

            update_links: function () {
                var m = this.get_marker(this.__current_marker).instance;
                var coords = m.marker().getLatLng();

                var links = this.__attach_collection[this.__current_marker];

                if(!links) return;

                var a = 0;
                while (a < links.length) {
                    var lid = links[a].lid;
                    var is_start = links[a].is_start;

                    var ldata = this.get_link(lid);



                    this.__leaflet_map.invalidateSize();
                    var p = this.__leaflet_map.getBounds();
                    var center = p.getCenter();
                    this.__styles = getComputedStyle(this._wrapper);
                    var width = parseInt(this.__styles.width) / 2;
                    var height = parseInt(this.__styles.height) / 2;
                    var ratio_1 = Math.pow(2, (this.__leaflet_map._zoom - 10) / 2);
                    var ratio_2 = Math.pow(2, (10 - this.__leaflet_map._zoom ) / 2);


                    var x = coords.lat * ratio_2;
                    var y = coords.lng * ratio_2;
                    var res_x  = /*center.lat*/ + x;
                    var res_y  = /*center.lng*/ + y;


                    //debugger;

                    if (is_start) {
                        ldata.instance.set_start(res_x, res_y);
                    } else {
                        ldata.instance.set_end(res_x, res_y);
                    }

                    ldata.instance.__svg.style.overflow = "initial";

                    a++;
                }

                //debugger;
            }

        });

        return map;
    })
})(window);