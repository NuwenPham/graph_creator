/**
 * Created by Cubla on 02.11.2017.
 */
(function (_export) {
    var name = "js/client/ui/overlaying";
    var libs = [
        "js/client/ui/lay"
    ];

    load_css("css/overlaying.css");
    define(name, libs, function () {
        var lay = require("js/client/ui/lay");
        var overlaying = lay.inherit({
            constructor: function overlaying(_options) {
                var options = {
                    width: 600,
                    height: 400
                };
                Object.extend(options, _options);
                lay.prototype.constructor.call(this, options);
            },
            destructor: function () {
                this.__root.remove_child(this.__right);
                this.__root.remove_child(this.__content);
                this.__root.remove_child(this.__left);
                this.remove_child(this.__root);

                this.__root.remove(this.__right);
                this.__root.remove(this.__content);
                this.__root.remove(this.__left);
                this.remove(this.__root);

                lay.prototype.destructor.call(this);
            },
            _init: function () {
                lay.prototype._init.call(this);
                this._init_root();
                this._init_left();
                this._init_content();
                this._init_right();

                this.add_event("click", function () {
                    this.trigger("closed");
                }.bind(this))
            },
            _init_root: function () {
                this.__root = new lay();
                this.add_child(this.__root);
                this.append(this.__root);
                this.__root.add_class("overlaying-root");
                this.__root.remove_class("ui-lay");
            },
            _init_left: function () {
                this.__left = new lay();
                this.__root.add_child(this.__left);
                this.__root.append(this.__left);
                this.__left.add_class("overlaying-left");
                this.__left.remove_class("ui-lay");
            },
            _init_content: function () {
                this.__content = new lay();
                this.__root.add_child(this.__content);
                this.__root.append(this.__content);
                this.__content.add_class("overlaying-content");
                this.__content.remove_class("ui-lay");
                this.__content.add_event("click", function (_event) {
                    _event.stopImmediatePropagation();
                });
            },
            _init_right: function () {
                this.__right = new lay();
                this.__root.add_child(this.__right);
                this.__root.append(this.__right);
                this.__right.add_class("overlaying-right");
                this.__right.remove_class("ui-lay");
            }
        });

        return overlaying;
    })
})(window);