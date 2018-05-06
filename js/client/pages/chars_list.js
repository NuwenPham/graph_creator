/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/chars_list";
    var libs = [
        "js/client/pages/page",
        "js/client/ui/lay",
        "js/client/ui/list/list",
        "js/client/ui/list/row",
        "js/client/ui/list/char/row",
        "js/client/ui/button",
        "js/client/requests/api/user/characters"
    ];

    load_css("css/pages/chars_list.css");

    define(name, libs, function () {
        var page = require("js/client/pages/page");
        var lay = require("js/client/ui/lay");
        var list = require("js/client/ui/list/list");
        var row = require("js/client/ui/list/row");

        var button = require("js/client/ui/button");
        var request_characters = require("js/client/requests/api/user/characters");
        var char_row = require("js/client/ui/list/char/row");




        var chars_list = page.inherit({
            constructor: function chars_list(_options) {
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

                this.request_chars();
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

                //var row1 = new row();
                //var row2 = new row();
                //var row3 = new row();
                //
                //this.__list.add(row1);
                //this.__list.add(row2);
                //this.__list.add(row3);
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
                nav.open("ccp_auth_page", {
                    from: "chars_list"
                });
            },
            __on_response_chars: function (_event) {
                if(_event.data.success){
                    var a = 0;
                    while( a < _event.data.characters.length ){
                        var char = _event.data.characters[a];

                        var rw = new char_row({
                            char_name: char.char_name,
                            char_id: char.id,
                            image: char.images.px64x64
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
            request_chars: function () {
                var token_id = sessionStorage.getItem("token");
                var rc = new request_characters({
                    token_id: token_id
                });
                rc.on("response", this.__on_response_chars.bind(this));
                rc.request();
            }
        });

        return chars_list;
    })
})(window);