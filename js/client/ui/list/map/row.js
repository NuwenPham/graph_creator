/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/ui/list/map/row";
    var libs = [
        "js/client/ui/lay",
        "js/client/ui/button",
        "js/client/ui/list/row",

        "js/client/requests/api/mapper/remove"
    ];

    load_css("css/list/map/row.css");

    define(name, libs, function () {
        var lay = require("js/client/ui/lay");
        var row = require("js/client/ui/list/row");
        var button = require("js/client/ui/button");

        var request_remove_character = require("js/client/requests/api/mapper/remove");
        var map_row = row.inherit({
            constructor: function map_row(_options) {
                var base = {
                    map_name: "",
                    map_id: ""
                };
                Object.extend(base, _options);

                this.__map_name = base.map_name;
                this.__map_id = base.map_id;

                row.prototype.constructor.call(this, base);
            },
            _init: function () {
                row.prototype._init.call(this);
                this.__init_name();
                this.__init_buttons();
                this.remove_class("ui-list-row");
                this.add_class("ui-list-map-row");
            },
            __init_name: function () {
                this.__name = new lay();
                this.__name.wrapper().innerText = this.__map_name;
                this.append(this.__name);
                this.__name.add_class("ui-list-map-row-name");
            },
            __init_buttons: function () {
                this.__del = new button({
                    text: "del"
                });
                this.__del.add_class("ui-chars-list-button");
                this.append(this.__del);
                this.__del.add_event("click", function () {

                    var token_id = sessionStorage.getItem("token");
                    var rrc = new request_remove_character({
                        token_id: token_id,
                        id: this.__map_id
                    });
                    rrc.on("response", function (_event) {
                        if(_event.data.success) {
                            this.trigger("del");
                        }
                    }.bind(this));
                    rrc.request();

                }.bind(this))
            }
        });

        return map_row;
    })
})(window);