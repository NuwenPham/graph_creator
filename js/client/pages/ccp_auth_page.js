/**
 * Created by Cubla on 23.10.2017.
 */

(function (_export) {
    var name = "js/client/pages/ccp_auth_page";
    var libs = [
        "js/client/basic",
        "js/client/ui/button",
        "js/client/ui/input"
    ];
    load_css("css/ccp_auth_page.css");
    define(name, libs, function () {
        var basic = require("js/client/basic");
        var button = require("js/client/ui/button");
        var input = require("js/client/ui/input");

        var ccp_auth_page = basic.inherit({
            constructor: function ccp_auth_page(_options) {
                var options = {};
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._pre_init();
            },
            destructor: function () {
                this.__hello_box.destructor();
                this.__btn_reg.destructor();
                this.__btn_auth.destructor();
                this.__hello_box_or.destructor();
                basic.prototype.constructor.call(this);
            },
            _pre_init: function () {
                this.__init_wrapper();
                this._client_id = dispatcher.add(this.__core_handler.bind(this));
                this.check_token();
            },
            _init: function () {
                this.__init_content_box();
                this.__init_btns();
            },
            __init_wrapper: function () {
                this.__wrapper = document.createElement("div");
                this.__wrapper.setAttribute("class", "page-hello-page centered-outer");
            },
            __init_content_box: function () {
                this.__content_box = document.createElement("div");
                this.__content_box.setAttribute("class", "reg-box-ccp centered-inner");
                this.__wrapper.appendChild(this.__content_box);
            },
            __init_btns: function () {
                this.__btn_submit = new button({
                    text: ""
                });
                this.__content_box.appendChild(this.__btn_submit.wrapper());

                this.__btn_submit.remove_class("ui-btn");
                this.__btn_submit.add_class("ccp-button");

                this.__btn_submit.add_event("click", this.__on_auth_click.bind(this));
            },
            __core_handler: function (_event) {
                var data = _event.data;
                var command = data.command_addr[data.command_addr.length - 1];
                switch (command) {
                    case "response_check_token":
                        if (data.success) {
                            this._init();
                        } else {
                            console.log("ccp_auth_page: bad token");
                            debugger;
                            nav.open("reg");
                        }
                        break;
                    default:
                        console.log("default event handler for command " + command);
                        break;
                }
            },
            __on_auth_click: function () {
                var response_url = location.origin + location.pathname;
                var data = {
                    response_type: "code",
                    client_id: "804ba189451a4b12af36a1f770d9a12d", // dan
                    scope: "esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-clones.read_clones.v1 esi-universe.read_structures.v1 esi-location.read_online.v1",
                    state: "ccp_auth_response",
                    redirect_uri: response_url
                };
                var destination = "https://login.eveonline.com/oauth/authorize/?";

                var res_arr = [];
                for(var k in data){
                    var val = data[k];
                    var loc = k + "=" + val;
                    res_arr.push(loc);
                }
                var result = res_arr.join("&");
                var url = destination + result;
                console.log("CCP_AUTH_URL " + url);
                location.href = url;
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

        return ccp_auth_page;
    })
})(window);