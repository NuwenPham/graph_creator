/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/main_menu";
    var libs = [
        "js/basic"
    ];

    define(name, libs, function () {
        var basic = require("js/basic");


        var main_menu = basic.inherit({
            constructor: function desktop(_options) {
                var options = {

                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },

            _init: function () {
                this.create_menu();

                var item = this.create_menu_item();
                this.add_menu_item(item);

                item.addEventListener("click", function(){
                    nav.open("games_list");
                }.bind(this));
            },

            add_menu_item: function(_item){
                this._menu.appendChild(_item);
            },

            create_menu_item: function(){
                var item = document.createElement("input");
                item.setAttribute("type", "button");
                item.setAttribute("value", "TEST");
                return item;
            },

            create_menu: function () {
                this._menu = document.createElement("div");
                this._menu.setAttribute("class", "menu");
                this._menu.style.width = "100%";
                this._menu.style.height = "100%";
                this._menu.style.color = "red";
                this._menu.style.background = "rebeccapurple";
            },

            get_dom_elem: function(){
                return this._menu;
            }

        });

        return main_menu;
    })
})(window);