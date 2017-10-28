(function (_export) {
    var name = "js/client/pages/reg";
    var libs = [
        "js/basic",
        "js/client/ui/button",
        "js/client/ui/lay",
        "js/client/ui/input"
    ];

    load_css("css/reg.css");

    define(name, libs, function () {
        var basic = require("js/basic");
        var button = require("js/client/ui/button");
        var input = require("js/client/ui/input");
        var lay = require("js/client/ui/lay");


        var hello_page = basic.inherit({
            constructor: function hello_page(_options) {
                var options = {

                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },

            destructor: function () {

            },

            _init: function () {
                this._client_id = dispatcher.add(this.__core_handler.bind(this));

                this.__init_wrapper();
                this.__init_content_box();
                this.__init_btns();
            },

            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "reg-page centered-outer");
            },

            __init_content_box: function () {
                this.__content_box = document.createElement("div");
                this.__content_box.setAttribute("class", "reg-box centered-inner");
                this.__wrapper.appendChild(this.__content_box);
            },

            __init_btns: function () {
                this.__mail = new input({
                    placeholder: "mail"
                });
                this.__content_box.appendChild(this.__mail.wrapper());

                //this.__nick = new input({
                //    placeholder: "nick"
                //});
                //this.__content_box.appendChild(this.__nick.wrapper());

                this.__password = new input({
                    placeholder: "password"
                });
                this.__content_box.appendChild(this.__password.wrapper());

                this.__password_repeat = new input({
                    placeholder: "password repeat"
                });
                this.__content_box.appendChild(this.__password_repeat.wrapper());

                this.__btn_submit = new button({
                    text: "reg"
                });
                this.__content_box.appendChild(this.__btn_submit.wrapper());
                this.__btn_submit.css({
                    width: "265px",
                    position: "relative",
                    top: "5px"
                });

                this.__btn_submit.add_event("click", this.__on_auth_click.bind(this));


                this.__error_lay = new lay();
                this.__content_box.appendChild(this.__error_lay.wrapper());
                this.__error_lay.remove_class("ui-lay");
                this.__error_lay.add_class("log_lay");
            },

            __on_auth_click: function () {
                var mail = this.__mail.value();
                var pass_1 = this.__password.value();
                var pass_2 = this.__password_repeat.value();

                if(mail && pass_1 && pass_2){
                    dispatcher.send(this._client_id, {
                        command_addr: ["api", "auth", "reg"],
                        mail: mail,
                        pass_1: pass_1,
                        pass_2: pass_2
                    });
                } else {
                    this.__error_lay.inner_text("wrong data");
                }

            },

            __core_handler: function (_event) {
                var data = _event.data;
                var command = data.command_addr[data.command_addr.length - 1];
                switch (command) {
                    case "response_reg":
                        if (data.success) {

                            sessionStorage.setItem("token", data.token);
                            nav.open("ccp_auth_page", {
                                from: "reg_page"
                            });
                        } else {
                            this.__error_lay.inner_text(data.text);
                            switch (data.error_id) {
                                case ERROR.USER_NOT_EXIST:

                                    break;
                                case ERROR.ALREADY_EXIST:

                                    break;
                                case ERROR.SHORTER_PASSWORD:

                                    break;
                                case ERROR.INVALID_MAIL:

                                    break;
                                case ERROR.PASSWORDS_NOT_MATCH:

                                    break;
                                case ERROR.PASSWORD_INCORRECT:

                                    break;
                                case ERROR.UNKNOWN:

                                    break;
                                default:
                                    console.log("Unknown ERROR " + data.error_id);
                                    break;
                            }
                        }
                        break;
                    default:
                        console.log("default event handler for command " + command);
                        break;
                }
                //debugger;
            },

            wrapper: function(){
                return this.__wrapper;
            }
        });

        var ERROR = {
            USER_NOT_EXIST: "USER_NOT_EXIST",
            SHORTER_PASSWORD: "SHORTER_PASSWORD",
            INVALID_MAIL: "INVALID_MAIL",
            PASSWORDS_NOT_MATCH: "PASSWORDS_NOT_MATCH",
            PASSWORD_INCORRECT: "PASSWORDS_NOT_MATCH",
            ALREADY_EXIST: "ALREADY_EXIST",
            UNKNOWN: "UNKNOWN"
        };

        return hello_page;
    })
})(window);