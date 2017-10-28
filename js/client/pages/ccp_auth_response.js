/**
 * Created by Cubla on 23.10.2017.
 */

(function (_export) {
    var name = "js/client/pages/ccp_auth_response";
    var libs = [
        "js/basic",
        "js/client/ui/button",
        "js/client/ui/input"
    ];

    load_css("css/ccp_auth_page.css");

    define(name, libs, function () {
        var basic = require("js/basic");
        var button = require("js/client/ui/button");
        var input = require("js/client/ui/input");


        var ccp_auth_response = basic.inherit({
            constructor: function ccp_auth_response(_options) {
                var options = {

                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._pre_init();
            },

            destructor: function () {

            },

            _pre_init: function () {
                this.__init_wrapper();
                this._client_id = dispatcher.add(this.__core_handler.bind(this));
                this.check_token();
            },

            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
            },

            _init: function () {
                var code = sessionStorage.getItem("code");
                if(!code){
                    nav.open("ccp_auth_page");
                    return;
                }

                sessionStorage.removeItem("code");
                dispatcher.send(this._client_id, {
                    command_addr: ["api", "auth", "ccp_auth"],
                    code: code,
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
                    case "response_ccp_auth":
                        if (data.success) {
                            // тогда отправляемся на первую страницу пользователя
                            nav.open("common_page");
                        } else {
                            switch (data.error_id) {
                                case ERROR.BAD_TOKEN:
                                    nav.open("auth");
                                    break;
                                case ERROR.CCP_AUTH_FAILED:
                                case ERROR.CCP_DATA_FAILED:
                                case ERROR.ATTACH_FAILED:
                                default:
                                    nav.open("ccp_auth_page");
                                    break;
                            }
                        }
                        break;
                    default:
                        console.log("default event handler for command " + command);
                        break;
                }
            },


            check_token: function () {
                var token_id = sessionStorage.getItem("token");
                dispatcher.send(this._client_id, {
                    command_addr: ["api", "auth", "check_token"],
                    token_id: token_id
                });
            },

            wrapper: function(){
                return this.__wrapper;
            }
        });

        var ERROR = {
            ATTACH_FAILED: "ATTACH_FAILED",
            CCP_DATA_FAILED: "CCP_DATA_FAILED",
            CCP_AUTH_FAILED: "CCP_AUTH_FAILED",
            BAD_TOKEN: "BAD_TOKEN",
            USER_NOT_EXIST: "USER_NOT_EXIST",
            SHORTER_PASSWORD: "SHORTER_PASSWORD",
            INVALID_MAIL: "INVALID_MAIL",
            PASSWORDS_NOT_MATCH: "PASSWORDS_NOT_MATCH",
            PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
            ALREADY_EXIST: "ALREADY_EXIST",
            UNKNOWN: "UNKNOWN"
        };

        return ccp_auth_response;
    })
})(window);