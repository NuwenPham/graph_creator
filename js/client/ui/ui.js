/**
 * Created by Cubla on 01.11.2017.
 */
(function (_export) {
    var name = "js/client/ui/ui";
    var libs = [
        "js/basic"
    ];

    load_css("css/button.css");


    define(name, libs, function () {
        var basic = require("js/basic");

        var ui = basic.inherit({
            constructor: function ui(_options) {
                var options = {};
                Object.extend(options, _options);
                this.__children = [];
                basic.prototype.constructor.call(this, options);
                window.addEventListener("resize", this.refresh.bind(this));
            },

            add_child: function (_child) {
                this.__children.push(_child);
            },

            remove_child: function (_child) {
                var index = this.__children.indexOf(_child);
                this.__children.splice(index, 1);
            },

            refresh: function (_event) {
                var a = 0;
                while( a < this.__children.length){
                    this.__children[a].refresh && this.__children[a].refresh(_event);
                    a++;
                }
            }

        });

        return ui;
    })
})(window);