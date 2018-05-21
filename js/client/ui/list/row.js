/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/ui/list/row";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/list/row.css");
    define(name, libs, function () {
        var lay = require("js/client/ui/lay");

        var list = lay.inherit({
            constructor: function input(_options) {
                var base = {};
                Object.extend(base, _options);
                lay.prototype.constructor.call(this, base);
                this._init();
            },
            _init: function () {
                lay.prototype._init.call(this);
                this.remove_class("ui-lay");
                this.add_class("ui-list-row");
            }
        });

        return list;
    })
})(window);