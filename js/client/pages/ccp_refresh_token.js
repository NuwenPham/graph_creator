/**
 * Created by Cubla on 03.12.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/ccp_refresh_token";
    var libs = [
        "js/client/pages/page"
    ];

    load_css("css/customs.css");

    define(name, libs, function () {
        var page = require("js/client/pages/page");

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
                this._client_id = dispatcher.add(this.__core_handler.bind(this));
                dispatcher.send(this._client_id, {
                    command_addr: ["api", "ccp", "character", "location", "current"],
                    token_id: sessionStorage.getItem("token")
                });
            },

            __core_handler: function (_event) {
                var data = _event.data;
                var command = data.command_addr[data.command_addr.length - 1];
                switch (command) {
                    case "response_check_token":
                        if (data.success) {
                            this._init();
                        } else {
                            console.log("bad token");
                            nav.open("reg");
                        }
                        break;
                    default:
                        console.log("default event handler for command " + command);
                        break;
                }
            }
        });

        return common_page;
    })
})(window);