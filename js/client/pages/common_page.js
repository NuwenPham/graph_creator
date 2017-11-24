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
        "js/client/ui/button",
        "js/client/ui/lay",
        "js/client/ui/overlaying",
        "js/client/modules/characters"
    ];

    load_css("css/customs.css");

    define(name, libs, function () {
        var page = require("js/client/pages/page");
        var button = require("js/client/ui/button");
        var lay = require("js/client/ui/lay");
        var overlaying = require("js/client/ui/overlaying");
        var characters = require("js/client/modules/characters");


        var common_page = page.inherit({
            constructor: function common_page(_options) {
                var options = {

                };
                Object.extend(options, _options);
                page.prototype.constructor.call(this, options);
            },

            destructor: function () {
            },

            _init: function () {

                this._init_root();
                this._init_header();
                this._init_content();
                this.refresh();
            },

            _init_root: function () {
                this.__root = new lay();
                this.add_child(this.__root);
                this.append(this.__root);
                this.__root.add_class("root");
                this.__root.remove_class("ui-lay");
            },

            _init_header: function () {
                this.__header = new lay();
                this.__root.add_child(this.__header);
                this.__root.append(this.__header);
                this.__header.add_class("cp-header");
                this.__header.remove_class("ui-lay");
            },

            _init_content: function () {
                //this.__content = new lay();
                //this.__root.add_child(this.__content);
                //this.__root.append(this.__content);
                //this.__content.add_class("cp-content");
                //this.__content.remove_class("ui-lay");

                this._init_map();
                this._init_map_info();
                this._init_sigs();


                //debugger;
                var ol = new characters();
                this.add_child(ol);
                this.append(ol);
                //
                //setTimeout(function () {
                //    this.remove_child(ol);
                //    this.remove(ol);
                //    ol.destructor();
                //}.bind(this), 2000);


            },

            _init_map: function () {
                this.__map = new lay();
                this.__root.add_child(this.__map);
                this.__root.append(this.__map);
                this.__map.add_class("cp-map");
                this.__map.remove_class("ui-lay");
            },

            _init_map_info: function () {
                this.__map_info = new lay();
                this.__root.add_child(this.__map_info);
                this.__root.append(this.__map_info);
                this.__map_info.add_class("cp-map-info");
                this.__map_info.remove_class("ui-lay");
            },

            _init_sigs: function () {

            }
        });

        return common_page;
    })
})(window);