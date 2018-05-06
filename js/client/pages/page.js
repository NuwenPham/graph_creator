/**
 * Created by Cubla on 01.11.2017.
 */

(function (_export) {
    var name = "js/client/pages/page";
    var libs = [
        "js//client/ui/lay",
        "js/client/ui/button"
    ];

    define(name, libs, function () {
        var lay = require("js/client/ui/lay");
        var button = require("js/client/ui/button");


        var page = lay.inherit({
            constructor: function page(_options) {
                var options = {

                };
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this._pre_init();
            },

            destructor: function () {
                lay.prototype.destructor.call(this);

            },

            _pre_init: function () {
                this._client_id = dispatcher.add(this.__core_handler.bind(this));
                this.check_token();
            },

            _after_init: function(){
                //lay.prototype._init.call(this);
            },

            __init_wrapper: function () {
                this.add_class("page-hello-page");
                this.add_class("centered-outer");
            },

            append: function (_lay) {
                this.__wrapper.appendChild(_lay.wrapper());
            },

            remove: function (_lay) {
                this.__wrapper.removeChild(_lay.wrapper());
            },

            check_token: function () {
                var token_id = sessionStorage.getItem("token");

                dispatcher.send(this._client_id, {
                    command_addr: ["api", "auth", "check_token"],
                    token_id: token_id
                });
            },

            __core_handler: function (_event) {
                var data = _event.data;
                var command = data.command_addr[data.command_addr.length - 1];
                switch (command) {
                    case "response_check_token":
                        if (data.success) {
                            this._after_init();
                        } else {
                            console.log("page: bad token");
                            nav.open("reg");
                        }
                        break;
                    default:
                        console.log("default event handler for command " + command);
                        break;
                }
            }
        });

        return page;
    })
})(window);