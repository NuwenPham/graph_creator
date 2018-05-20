/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/map";
    var libs = [
        "js/client/pages/page",
        "js/client/ui/lay",
        "js/client/ui/button",
        "js/client/requests/api/mapper/add",
        "js/client/requests/api/mapper/remove",

        "js/client/requests/api/mapper/topo",
        "js/client/ui/ll/map",
        "js/client/ui/ll/marker",
        "js/client/ui/ll/line"
    ];

    load_css("css/pages/map_list.css");

    define(name, libs, function () {
        var page = require("js/client/pages/page");
        var lay = require("js/client/ui/lay");
        var button = require("js/client/ui/button");
        var request_topo = require("js/client/requests/api/mapper/topo");
        //var request_add_map = require("js/client/requests/api/mapper/add");
        //var request_remove_map = require("js/client/requests/api/mapper/remove");

        var Map = require("js/client/ui/ll/map");
        var marker = require("js/client/ui/ll/marker");
        var link = require("js/client/ui/ll/line");

        var MapPage = page.inherit({
            constructor: function maps_list(_options, _query) {
                var options = {};
                Object.extend(options, _options);
                page.prototype.constructor.call(this, options, _query);

                this.__map_id = _query;
            },

            destructor: function () {
                page.prototype.destructor.call(this);
            },

            _after_init: function () {
                page.prototype._after_init.call(this);
                this.__init_content();
                this.__init_map();
                this.request_topo();
                this.refresh();
            },
            __init_content: function () {
                this.add_class("centered-outer fs");
            },
            __init_map: function () {
                this.__map = new Map();
                this.append(this.__map);
                this.__map.css("height", "100%");

                this.__map.add_event("click", this.__on_click_map.bind(this));
            },
            __on_click_map: function (_event) {

            },
            add_system: function (_event) {
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
                    text: rnd > 0.5 ? "J123420" : "5ZXX3-0"
                });
                this.__map.add_marker(m);
                this.__map.update_all_markers();
            },
            request_topo: function () {
                var token_id = sessionStorage.getItem("token");
                var rt = new request_topo({
                    map_id: this.__map_id,
                    token_id: token_id
                });
                rt.on("response", this.__on_response_topo.bind(this));
                rt.request();
            },
            __on_response_topo: function (_data) {
                var sys_id = {};
                //debugger;
                var a = 0;
                while( a < _data.data.systems.length) {
                    var sys = _data.data.systems[a];

                    var m = new marker({
                        coords: [a * 150, a * 10],
                        movable: true,
                        has_bonus: true,
                        //text: sys.solar_system_id,
                        text: sys.name,
                    });

                    var mid = this.__map.add_marker(m);
                    sys_id[sys.solar_system_id] = mid;
                    a++;
                }

                a = 0;
                while( a < _data.data.links.length) {
                    var link_data = _data.data.links[a];
                    var l = new link();
                    var lid = this.__map.add_link(l);

                    var from = sys_id[link_data.solar_system_id_from];
                    var to = sys_id[link_data.solar_system_id_to];

                    this.__map.attach_link_to(lid, from, true);
                    this.__map.attach_link_to(lid, to, false);

                    this.__map.update_marker_link(from);
                    this.__map.update_marker_link(to);
                    a++;
                }

                this.__map.update_all_markers();
                this.__map.update_all_links();

            },
            refresh: function () {
                page.prototype.refresh.call(this);
                this.__map.update_all_markers();
            }
        });

        return MapPage;
    });
})(window);