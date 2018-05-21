/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/requests/request";
    var libs = [
        "js/client/basic"
    ];

    define(name, libs, function () {
        var basic = require("js/client/basic");
        var request = basic.inherit({
            constructor: function page(_options) {
                var base = {
                    command_addr:  []
                };
                Object.extend(base, _options);
                basic.prototype.constructor.call(this, base);
                this._client_id = dispatcher.add(this.__core_handler.bind(this));
                this.__command_addr = base.command_addr;
            },
            destructor: function () {
                dispatcher.remove(this._client_id);
                basic.prototype.destructor.call(this);
            },
            __core_handler: function (_event) {
                var data = _event.data;
                var command = data.command_addr[data.command_addr.length - 1];
                this.trigger("response", {
                    command: command,
                    data: data
                });
            },
            data: function () {
                return {
                    command_addr: this.__command_addr
                }
            },
            request: function () {
                dispatcher.send(this._client_id, this.data());
            }
        });

        return request;
    })
})(window);