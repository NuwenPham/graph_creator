(function (_export) {
    var name = "js/client/pages/reg";
    var libs = [
        "js/basic",
        "js/client/ui/button",
        "js/client/ui/input"
    ];

    load_css("css/reg.css");

    define(name, libs, function () {
        var basic = require("js/basic");
        var button = require("js/client/ui/button");
        var input = require("js/client/ui/input");


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

                this.__nick = new input({
                    placeholder: "nick"
                });
                this.__content_box.appendChild(this.__nick.wrapper());

                this.__password = new input({
                    placeholder: "password"
                });
                this.__content_box.appendChild(this.__password.wrapper());

                this.__password_repeat = new input({
                    placeholder: "password repeat"
                });
                this.__content_box.appendChild(this.__password_repeat.wrapper());

                this.__btn_submit = new button({
                    text: "auth"
                });
                this.__content_box.appendChild(this.__btn_submit.wrapper());
                this.__btn_submit.css({
                    width: "265px",
                    position: "relative",
                    top: "5px"
                });

                this.__btn_submit.add_event("click", this.__on_auth_click.bind(this));
            },

            __on_auth_click: function () {
                dispatcher.send(this._client_id, {
                    //server_id: server.server_id,
                    command_addr: ["api", "auth", "reg"]
                });
            },

            __core_handler: function (_data) {
                debugger;
            },

            wrapper: function(){
                return this.__wrapper;
            }
        });

        return hello_page;
    })
})(window);