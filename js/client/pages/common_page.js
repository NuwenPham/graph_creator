/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/common_page";
    var libs = [
        "js/client/pages/page",
        "js/client/ui/lay",
        "js/client/ui/list/list",
        "js/client/ui/list/row",
        "js/client/ui/button"
    ];

    load_css("css/pages/common_page.css");

    define(name, libs, function () {
        var page = require("js/client/pages/page");
        var lay = require("js/client/ui/lay");
        var list = require("js/client/ui/list/list");
        var row = require("js/client/ui/list/row");

        var button = require("js/client/ui/button");


        var common_page = page.inherit({
            constructor: function common_page(_options) {
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
                this.__init_buttons();

                this.refresh();
            },
            __init_content: function () {
                this.add_class("centered-outer fs");

                this.__content = new lay();
                this.__content.add_class("ui-common-page-content");
                this.__content.add_class("centered-inner");

                this.append(this.__content);
            },
            __init_menu: function () {
                this.__list = new list();
                this.__content.append(this.__list);

                var row1 = new row();
                var row2 = new row();
                var row3 = new row();

                this.__list.add(row1);
                this.__list.add(row2);
                this.__list.add(row3);
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
            }
        });

        return common_page;
    })
})(window);