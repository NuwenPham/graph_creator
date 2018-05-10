/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/maps_list";
    var libs = [
        "js/client/pages/page",
        "js/client/ui/lay",
        "js/client/ui/list/list",
        "js/client/ui/list/row",
        "js/client/ui/list/map/row",
        "js/client/ui/button",
        "js/client/requests/api/mapper/list",
        "js/client/requests/api/mapper/add",
        "js/client/requests/api/mapper/remove"
    ];

    load_css("css/pages/map_list.css");

    define(name, libs, function () {
        var page = require("js/client/pages/page");
        var lay = require("js/client/ui/lay");
        var list = require("js/client/ui/list/list");
        var row = require("js/client/ui/list/row");

        var button = require("js/client/ui/button");
        var request_map_list = require("js/client/requests/api/mapper/list");
        //var request_add_map = require("js/client/requests/api/mapper/add");
        //var request_remove_map = require("js/client/requests/api/mapper/remove");

        var map_row = require("js/client/ui/list/map/row");

        var maps_list = page.inherit({
            constructor: function maps_list(_options) {
                var options = {

                };
                Object.extend(options, _options);
                page.prototype.constructor.call(this, options);
            },

            destructor: function () {
                page.prototype.destructor.call(this);
            },

            _after_init: function () {
                page.prototype._after_init.call(this);
                this.__init_content();
                this.__init_panel();
                this.__init_menu();
                this.__init_bottom();

                this.request_map_list();
                this.refresh();
            },
            __init_content: function () {
                this.add_class("centered-outer fs");

                this.__content = new lay();
                this.__content.add_class("ui-chars-list-page-content");
                this.__content.add_class("centered-inner");

                this.append(this.__content);
            },
            __init_panel: function () {
                this.__panel = new lay();
                this.__content.append(this.__panel);
                this.__panel.add_class("ui-chars-list-panel");

                this.__add = new button({
                    text: "add"
                });
                this.__add.add_class("ui-chars-list-add");
                this.__panel.append(this.__add);
                this.__add.add_event("click", this.__on_add_click.bind(this));
            },
            __init_menu: function () {
                this.__list = new list();
                this.__content.append(this.__list);
            },
            __init_bottom: function () {
                this.__panel = new lay();
                this.__content.append(this.__panel);
                this.__panel.add_class("ui-chars-list-panel");

                this.__back = new button({
                    text: "back"
                });
                this.__back.add_class("ui-chars-list-add");
                this.__panel.append(this.__back);
                this.__back.add_event("click", this.__on_back_click.bind(this));
            },
            __init_buttons: function () {
                this.__btn_chars = new button({
                    text: "chars"
                });
                this.__content.append(this.__btn_chars);
                this.__btn_chars.css({
                    width: "100%"
                });
                this.__btn_chars.add_event("click", function () {
                    nav.open("chars_list");
                });

                this.__btn_maps = new button({
                    text: "maps"
                });
                this.__content.append(this.__btn_maps);
                this.__btn_maps.css({
                    width: "100%"
                });
                this.__btn_maps.add_event("click", function () {
                    nav.open("map_list");
                });
            },
            __on_add_click: function () {
                nav.open("add_map",{
                    from: "chars_list"
                });
            },
            __on_back_click: function () {
                nav.open("common_page", {
                    from: "chars_list"
                });
            },
            __on_response_maps: function (_event) {
                if(_event.data.success){
                    var a = 0;
                    while( a < _event.data.list.length ){
                        var char = _event.data.list[a];

                        var rw = new map_row({
                            map_name: char.name,
                            map_id: char.id
                        });
                        this.__list.add(rw);

                        rw.on("del", function(_rw){
                            this.__list.del(_rw);
                        }.bind(this, rw));
                        a++;
                    }
                } else {

                }
            },
            request_map_list: function () {
                var token_id = sessionStorage.getItem("token");
                var rc = new request_map_list({
                    token_id: token_id
                });
                rc.on("response", this.__on_response_maps.bind(this));
                rc.request();
            }
        });

        return maps_list;
    });
})(window);