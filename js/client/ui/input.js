/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/client/ui/input";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/input.css");
    define(name, libs, function () {
        var lay = require("js/client/ui/lay");
        var input = lay.inherit({
            constructor: function input(_options) {
                var options = {
                    elem_type: "input",
                    value: "",
                    placeholder: ""
                };
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
                this._init();
            },
            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");
                this.add_class("ui-inp");
                this.attrs({
                    value: this._opts.value,
                    placeholder: this._opts.placeholder
                });
            }
        });

        return input;
    })
})(window);