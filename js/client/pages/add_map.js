/**
 * Created by Cubla on 16.09.2017.
 */
/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/add_map";
    var libs = [
        "js/client/basic",
        "js/client/ui/button",
        "js/client/ui/lay",
        "js/client/ui/input",
        "js/client/requests/api/mapper/add",
        "js/client/pages/page"
    ];

    load_css("css/hello_page.css");

    define(name, libs, function () {
        var page = require("js/client/pages/page");

        var basic = require("js/client/basic");
        var button = require("js/client/ui/button");
        var input = require("js/client/ui/input");
        var lay = require("js/client/ui/lay");
        var request_add_map = require("js/client/requests/api/mapper/add");

        var auth = page.inherit({
            constructor: function auth(_options) {
                var options = {};
                Object.extend(options, _options);
                page.prototype.constructor.call(this, options);
            },
            destructor: function () {
                this.__hello_box.destructor();
                this.__btn_reg.destructor();
                this.__btn_auth.destructor();
                this.__hello_box_or.destructor();
            },
            _after_init: function () {
                page.prototype._after_init.call(this);

                this.__init_wrapper();
                this.__init_content_box();
                this.__init_btns();

                this.refresh();
            },
            __init_wrapper: function () {
                this.add_class("centered-outer page-hello-page");
            },
            __init_content_box: function () {
                this.__content_box = new lay();
                this.__content_box.add_class("reg-box");
                this.__content_box.add_class("centered-inner");

                this.append(this.__content_box);
            },
            __init_btns: function () {
                this.__name = new input({
                    placeholder: "map name"
                });
                this.__content_box.append(this.__name);

                this.__password = new input({
                    placeholder: "map password (if want)"
                });
                this.__content_box.append(this.__password);

                this.__btn_submit = new button({
                    text: "create map"
                });
                this.__content_box.append(this.__btn_submit);
                this.__btn_submit.css({
                    width: "265px",
                    position: "relative",
                    top: "5px"
                });
                this.__btn_submit.add_event("click", this.__on_add_click.bind(this));

                this.__error_lay = new lay();
                this.__content_box.append(this.__error_lay);
                this.__error_lay.remove_class("ui-lay");
                this.__error_lay.add_class("log_lay");
            },
            __on_add_click: function () {
                var name = this.__name.value();
                var password = this.__password.value();
                var token_id = sessionStorage.getItem("token");
                if(name && password !== undefined){
                    var ram = new request_add_map({
                        token_id: token_id,
                        name: name,
                        password: password
                    });
                    ram.on("response", function (_event) {
                        if (_event.data.success) {
                            nav.open("maps_list", {
                                from: "add_map"
                            });
                        } else {
                            this.__error_lay.inner_text(_event.data.text);
                        }
                    }.bind(this));
                    ram.request();
                }

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

        return auth;
    });
})(window);