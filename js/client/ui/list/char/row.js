/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/ui/list/char/row";
    var libs = [
        "js/client/ui/lay",
        "js/client/ui/button",
        "js/client/ui/list/row",

        "js/client/requests/api/user/remove_character"
    ];

    load_css("css/list/char/row.css");
    define(name, libs, function () {
        var lay = require("js/client/ui/lay");
        var row = require("js/client/ui/list/row");
        var button = require("js/client/ui/button");

        var request_remove_character = require("js/client/requests/api/user/remove_character");
        var char_row = row.inherit({
            constructor: function input(_options) {
                var base = {
                    char_name: "",
                    char_id: ""
                };
                Object.extend(base, _options);

                this.__char_name = base.char_name;
                this.__char_id = base.char_id;
                this.__image = base.image;

                row.prototype.constructor.call(this, base);
            },
            _init: function () {
                row.prototype._init.call(this);
                this.__init_icon();
                this.__init_name();
                this.__init_buttons();
                this.remove_class("ui-list-row");
                this.add_class("ui-list-char-row");
            },
            __init_icon: function () {
                this.__icon = new lay();
                this.append(this.__icon);
                this.__icon.add_class("ui-list-char-row-icon");
                this.__icon.css("background-image", "url(" + this.__image + ")");
            },
            __init_name: function () {
                this.__name = new lay();
                this.__name.wrapper().innerText = this.__char_name;
                this.append(this.__name);
                this.__name.add_class("ui-list-char-row-name");
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
                        char_id: this.__char_id
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

        return char_row;
    })
})(window);