/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/ll/map";
    var libs = [
        "js/client/ui/lay",
        "js/client/ui/ll/line",
        "js/client/ui/ll/marker"
    ];

    load_css("css/map.css");

    var m_counter = 2;
    var l_counter = 2;


    define(name, libs, function () {
        var lay = require("js/client/ui/lay");
        var link = require("js/client/ui/ll/line");
        var marker = require("js/client/ui/ll/marker");


        var map = lay.inherit({
            constructor: function map(_options) {
                var options = {};
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this.__markers = Object.create(null);
                this.__links = {};
                this.__marker_on_link_attach_collection = {};
                this.__link_to_markers_attach_collection = {};
                this._init();
            },

            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");

                this.__actions = {
                    __on_marker_move: this.__on_marker_move.bind(this),
                    __on_marker_up: this.__on_marker_up.bind(this)
                    //__on_marker_out: this.__on_marker_out.bind(this)
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

            add_marker: function (_marker, _is_holder) {
                var mid = m_counter++;
                this.lm().addLayer(_marker.marker());
                this.__markers[mid] = {
                    instance: _marker,
                    mousedown: this.__on_marker_down.bind(this, mid),
                    is_holder: _is_holder
                };


                _marker.__el.style["margin-top"] = 0;
                _marker.__el.style["margin-left"] = 0;

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

            remove_link: function (_lid) {
                var data = this.__links[_lid];
                if(data){
                    this.lm().removeLayer(data.instance.marker());
                    delete this.__links[_lid];
                }
            },

            remove_marker: function (_mid) {
                var marker = this.__markers[_mid];
                if(marker){
                    if(this.__current_marker == _mid){
                        // снять обработчики
                        window.removeEventListener("mousemove", this.__actions.__on_marker_move);
                        window.removeEventListener("mouseup", this.__actions.__on_marker_up);
                    }
                    marker.mousedown && marker.instance.off("mousedown", marker.mousedown);
                    marker.mouseover && marker.instance.off("mouseover", marker.mouseover);
                }
                this.lm().removeLayer(marker.instance.marker());
                delete this.__markers[_mid];
            },

            markers: function () {
                return this.__markers;
            },

            __on_marker_down: function (_mid, _event) {

                this.lm().dragging.disable();

                if(!this.__current_marker) {

                    if(_event.ctrlKey && _event.altKey){
                        this.remove_marker(_mid);
                        _event.stopPropagation();
                        this.lm().dragging.enable();
                        return;
                    }

                    if(_event.ctrlKey){
                        _mid = this.__create_link_holder(_mid, _event);
                        _event.stopPropagation();
                        //this.lm().dragging.enable();
                        //return;
                    }
                    this.__current_marker = _mid;
                    var marker = this.__markers[_mid].instance;
                    var _mrk = marker.marker();
                    var _map = this.lm();
                    _map.dragging.disable();

                    if(window.ddbg) debugger;

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

                    this.update_marker_link(this.__current_marker);
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


                this.update_all_markers();
                this.update_all_links();
            },

            create_link: function (_mid) {
                var l = new link();
                var lid = this.add_link(l);

                //debugger;
                this.attach_link_to(lid, _mid, true);
                this.attach_link_to(lid, _mid - 1, false);

                this.update_marker_link(_mid);
                this.update_marker_link(_mid - 1);

            },

            attach_link_to : function (_lid, _mid, _is_start) {

                if(_lid === undefined){
                    //debugger;
                }

                if (!this.__marker_on_link_attach_collection[_mid]) {
                    this.__marker_on_link_attach_collection[_mid] = [];
                }
                this.__marker_on_link_attach_collection[_mid].push({lid: _lid, is_start: _is_start});

                if (!this.__link_to_markers_attach_collection[_lid]) {
                    this.__link_to_markers_attach_collection[_lid] = {};
                }

                if (_is_start) {
                    this.__link_to_markers_attach_collection[_lid].start_mid = _mid;
                } else {
                    this.__link_to_markers_attach_collection[_lid].end_mid = _mid;
                }

            },

            detach_link_from: function (_lid, _mid) {

                var links = this.__marker_on_link_attach_collection[_mid];

                if(!links) return;

                var a = 0;
                while( a < links.length){
                    if(links[a].lid == _lid){
                        links.splice(a, 1);
                    }
                    a++;
                }

                var attached_mids = this.__link_to_markers_attach_collection[_lid];
                var end_mid = attached_mids.end_mid;
                var start_mid = attached_mids.start_mid;

                if(start_mid !== undefined && start_mid == _mid){
                    delete attached_mids.start_mid;
                }

                if(end_mid !== undefined && end_mid == _mid){
                    delete attached_mids.end_mid;
                }

            },

            get_marker: function (_mid) {
                return this.__markers[_mid];
            },

            get_link: function (_lid) {
                return this.__links[_lid];
            },

            update_all_markers: function () {
                var markers = this.markers();
                var ratio = Math.pow(2, (this.lm()._zoom - 10) / 2);

                for(var k in markers){
                    var mrk = markers[k].instance;
                    var el = mrk.dom();
                    var width = mrk._opts.width * ratio;
                    var height = mrk._opts.height * ratio;
                    el.style.width = width + "px";
                    el.style.height = height + "px";

                    el.style.fontSize = (mrk._opts.font_size * ratio) + "px";

                }

            },

            update_all_links: function () {
                for(var k in this.__markers){
                    this.update_marker_link(k);
                }
            },

            update_marker_link: function (_mid) {
                var m = this.get_marker(_mid).instance;
                var coords = m.marker().getLatLng();

                var links = this.__marker_on_link_attach_collection[_mid];

                if(!links) return;

                var a = 0;
                while (a < links.length) {
                    var lid = links[a].lid;
                    var is_start = links[a].is_start;

                    var ldata = this.get_link(lid);


                    this.__leaflet_map.invalidateSize();
                    this.__styles = getComputedStyle(this._wrapper);
                    var ratio_1 = Math.pow(2, (this.__leaflet_map._zoom - 10) / 2);

                    var marker_offset_x = m._opts.width / 2;
                    var marker_offset_y = m._opts.height / 2;

                    var x = (coords.lat + marker_offset_x) * ratio_1;
                    var y = (coords.lng + marker_offset_y) * ratio_1;
                    var res_x = x;
                    var res_y = y;

                    ldata.instance.__line.setAttribute("stroke-width", 2 * ratio_1 );

                    ldata.instance[(is_start ? "set_start" : "set_end")](res_x, res_y);
                    ldata.instance.__svg.style.overflow = "initial";

                    a++;
                }

                //debugger;
            },

            __create_link_holder: function (_mid, _event) {
                this.__holding_source_mid = _mid;

                var m = this.get_marker(_mid).instance;
                var sc = m.marker().getLatLng();
                //var coords = this.calculate_for_marker(_mid, sc., _event.clientY);

                var holder_width = 10;
                var holder_height = 10;

                //debugger;
                var start_m = new marker({
                    width: holder_width,
                    height: holder_height,
                    coords: [sc.lat + (m._opts.width / 2 - (holder_width / 2)), sc.lng + (m._opts.height / 2- (holder_height / 2))]
                });
                var start_mid = this.add_marker(start_m, true);

                coords = this.calculate_for_marker(_mid, _event.clientX, _event.clientY, holder_width, holder_height);
                var new_m = new marker({
                    width:holder_width,
                    height:holder_height,
                    movable: true,
                    coords : [coords.x, coords.y]
                });
                new_m.css({
                    border: "1px solid color",
                    "border-radius": "5px"
                });

                var end_mid = this.add_marker(new_m, true);

                var lid = this.add_link(new link());

                this.attach_link_to(lid, start_mid, true);
                this.attach_link_to(lid, end_mid, false);

                this.update_marker_link(start_mid);
                this.update_marker_link(end_mid);


                this.__holding_start_mid = start_mid;
                this.__holding_end_mid = end_mid;
                this.__holding_lid = lid;

                this.__add_to_all_markers_over();
                return end_mid;
            },


            calculate_for_marker: function (_mid, _sx, _sy, _tw, _th) {
                var m = this.get_marker(_mid).instance;

                var p = this.lm().getBounds();
                var center = p.getCenter();
                this.__styles = getComputedStyle(this._wrapper);
                var width = parseInt(this.__styles.width) / 2;
                var height = parseInt(this.__styles.height) / 2;
                var ratio_1 = Math.pow(2, (this.lm()._zoom - 10) / 2);
                var ratio_2 = Math.pow(2, (10 - this.lm()._zoom ) / 2);

                var marker_offset_x = _tw / 2 * ratio_1;
                var marker_offset_y = _th / 2 * ratio_1;

                var x = (_sx - width - marker_offset_x) * ratio_2;
                var y = (_sy - height - marker_offset_y) * ratio_2;
                var res_x = center.lat + x;
                var res_y = center.lng + y;

                return {
                    x: res_x,
                    y: res_y
                }
            },

            __add_to_all_markers_over: function(){
                window.addEventListener("mouseup", this.__actions.__on_marker_up);

                for(var k in this.__markers){
                    var data = this.__markers[k];
                    if(data.instance.is_movable()) {
                        data.mouseover = this.__on_marker_over.bind(this, k);
                        data.instance.dom().addEventListener("mouseover", data.mouseover);
                    }
                }
            },

            __remove_from_all_markers_over: function(){
                window.addEventListener("mouseup", this.__actions.__on_marker_up);

                for(var k in this.__markers){
                    var data = this.__markers[k];
                    if(data.instance.is_movable()) {
                        data.instance.dom().removeEventListener("mouseover", data.mouseover);
                    }
                }
            },

            __on_marker_over: function (_mid) {

                if(_mid == this.__holding_source_mid){
                    return;
                }

                if(this.get_marker(_mid).is_holder){
                    return;
                }

                this.detach_link_from(this.__holding_lid, this.__holding_start_mid);
                this.detach_link_from(this.__holding_lid, this.__holding_end_mid);

                this.attach_link_to(this.__holding_lid, this.__holding_source_mid, true);
                this.attach_link_to(this.__holding_lid, _mid, false);

                this.update_marker_link(this.__holding_source_mid);
                this.update_marker_link(_mid);

                this.__remove_from_all_markers_over();

                this.remove_marker(this.__holding_start_mid);
                this.remove_marker(this.__holding_end_mid);

                this.__holding_start_mid = undefined;
                this.__holding_end_mid = undefined;
                this.__holding_lid = undefined;
                this.__holding_source_mid = undefined;


                if(this.__current_marker) {
                    window.removeEventListener("mousemove", this.__actions.__on_marker_move);
                    window.removeEventListener("mouseup", this.__actions.__on_marker_up);
                    this.lm().dragging.enable();
                    this.__current_marker = null;
                }

            }

        });

        return map;
    })
})(window);