/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/button";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/button.css");


    define(name, libs, function () {
        var lay = require("js/client/ui/lay");

        var button = lay.inherit({
            constructor: function button(_options) {
                var options = {
                    elem_type: "div",
                    text: "test"
                };
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this._init();
            },

            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");
                this.add_class("ui-btn");
                this._wrapper.innerText = this._opts.text;
            }
        });

        return button;
    })
})(window);