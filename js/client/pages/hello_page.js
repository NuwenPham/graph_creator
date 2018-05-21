/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/hello_page";
    var libs = [
        "js/client/basic",
        "js/client/ui/button"
    ];

    load_css("css/hello_page.css");
    define(name, libs, function () {
        var basic = require("js/client/basic");
        var button = require("js/client/ui/button");
        var hello_page = basic.inherit({
            constructor: function hello_page(_options) {
                var options = {

                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },
            destructor: function () {
                this.__hello_box.destructor();
                this.__btn_reg.destructor();
                this.__btn_auth.destructor();
                this.__hello_box_or.destructor();
            },
            _init: function () {
                this.__init_wrapper();
                this.__init_hello_box();
                this.__init_btns();
            },
            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
            },
            __init_hello_box: function () {
                this.__hello_box = document.createElement("div");
                this.__hello_box.setAttribute("class", "page-hello-box centered-inner");
                this.__wrapper.appendChild(this.__hello_box);
            },
            __init_btns: function () {
                this.__btn_reg = new button({
                    text: "registration"
                });
                this.__hello_box.appendChild(this.__btn_reg.wrapper());
                this.__btn_reg.add_class("ui-hello-page-btn-left");
                this.__btn_reg.add_event("click", function(){
                    nav.open("reg");
                });

                this.__hello_box_or = document.createElement("span");
                this.__hello_box_or.setAttribute("class", "page-hello-or");
                this.__hello_box_or.innerText = "or";
                this.__hello_box.appendChild(this.__hello_box_or);

                this.__btn_auth = new button({
                    text: "auth"
                });
                this.__hello_box.appendChild(this.__btn_auth.wrapper());
                this.__btn_auth.add_class("ui-hello-page-btn-right");
                this.__btn_auth.add_event("click", function(){
                    nav.open("auth");
                })
            },
            wrapper: function(){
                return this.__wrapper;
            }
        });

        return hello_page;
    })
})(window);