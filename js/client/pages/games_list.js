/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/pages/games_list";
    var libs = [
        "js/basic",
        "js/client/ui/lay",
        "js/client/views/field"
    ];

    define(name, libs, function () {
        var basic = require("js/basic");
        var v_field = require("js/client/views/field");
        var lay = require("js/client/ui/lay");


        var games_list = basic.inherit({
            constructor: function games_list(_options) {
                var options = {

                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._init();
            },

            _init: function () {
                this._background = new lay();
                this._background.css({});

                var top_container = new lay();
                top_container.css({
                    height: "40px",
                    border: "1px solid #222"
                });
                this._background.append(top_container);

                var bottom_container = new lay();
                bottom_container.css({
                    height: "calc(100% - 40px)",
                    border: "1px solid #777"
                });
                this._background.append(bottom_container);

                this._top_container_content();
                this._bottom_container_content();
            },

            _top_container_content: function () {
                var top_container = new lay({
                    elem_type: "input"
                });
                top_container.css({
                    width: "100px",
                    height: "40px",
                    border: "1px solid #222"
                });
                top_container.attrs({

                })
            },

            _bottom_container_content: function () {

            },

            get_dom_elem: function(){
                return this._background.wrapper();
            }

        });

        return games_list;
    })
})(window);