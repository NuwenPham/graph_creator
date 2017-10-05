/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/navigation";
    var libs = [
        "js/basic",
        "js/client/pages_list",

        "js/client/pages/hello_page",
        "js/client/pages/main_menu",
        "js/client/pages/error_404",
        "js/client/pages/game_field",
        "js/client/pages/games_list",
        "js/client/pages/game_field_2"
    ];




    define(name, libs, function () {
        var basic = require("js/basic");

        var pages_map = require("js/client/pages_list");

        var navigation = basic.inherit({
            constructor: function navigation(_options) {
                var options = {
                    redirect_error_page: "error_404"
                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);

                this._init();
            },

            _init: function () {
                document.body.style.width = "100%";
                document.body.style.height = "100%";
                document.body.style.margin = "0";

                var hashchange = function (_event) {
                    var page_id = _event.newURL.split("/").pop().split("#").pop();
                    if (this._history[this._history.length - 1] != page_id) {
                        this.open(page_id);
                    }
                }.bind(this);

                window.addEventListener("hashchange", hashchange);
                this._history = [];
            },

            open: function (_id) {
                var is_error_page = false;
                if (!pages_map[_id]) {
                    _id = this._opts.redirect_error_page;
                    is_error_page = true;
                }
                var _page = new pages_map[_id]();
                var elem = _page.wrapper();

                //debugger;
                document.body.appendChild(elem);
                //if (!_not_api_call || is_error_page) {
                    window.location = "#" + _id;
                //}

                this._history.push(_id);
                this._last_child && document.body.removeChild(this._last_child);
                this._last_child = elem;
            },

            back: function(){
                this._history.pop();
                if(this._history.length != 0) this.open(this._history.pop());
            }
        });

        return navigation;
    })
})(window);