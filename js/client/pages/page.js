/**
 * Created by Cubla on 01.11.2017.
 */

(function (_export) {
    var name = "js/client/pages/page";
    var libs = [
        "js//client/ui/ui",
        "js/client/ui/button"
    ];

    define(name, libs, function () {
        var ui = require("js/client/ui/ui");
        var button = require("js/client/ui/button");


        var page = ui.inherit({
            constructor: function page(_options) {
                var options = {

                };
                Object.extend(options, _options);
                ui.prototype.constructor.call(this, options);
                this._pre_init();
            },

            destructor: function () {

            },

            _pre_init: function () {
                this.__init_wrapper();
                this._client_id = dispatcher.add(this.__core_handler.bind(this));
                this.check_token();
            },

            _init: function(){
            },

            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
            },

            wrapper: function(){
                return this.__wrapper;
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

        return page;
    })
})(window);