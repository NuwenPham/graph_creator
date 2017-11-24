/**
 * Created by Cubla on 02.11.2017.
 */

(function (_export) {
    var name = "js/client/modules/characters";
    var libs = [
        "js/client/ui/overlaying"
    ];

    load_css("css/overlaying.css");

    define(name, libs, function () {
        var overlaying = require("js/client/ui/overlaying");

        var characters = overlaying.inherit({
            constructor: function characters(_options) {
                var options = {

                };
                Object.extend(options, _options);
                overlaying.prototype.constructor.call(this, options);
            },

            destructor: function () {
                dispatcher.remove(this._client_id);
                overlaying.prototype.destructor.call(this);
            },

            // запросить список чаров
            _init: function () {
                this._client_id = dispatcher.add(this.__core_handler.bind(this));
                overlaying.prototype._init.call(this);
            },

            _init_content: function () {
                overlaying.prototype._init_content.call(this);

                var token_id = sessionStorage.getItem("token");
                dispatcher.send(this._client_id, {
                    command_addr: ["api", "user", "characters"],
                    token_id: token_id
                });

            },

            __core_handler: function (_event) {
                var data = _event.data;
                var command = data.command_addr[data.command_addr.length - 1];
                switch (command) {
                    case "response_characters":
                        debugger;
                        break;
                    default:
                        console.log("default event handler for command " + command);
                        break;
                }
            }
        });

        return characters;
    })
})(window);