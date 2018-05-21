/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/dispatcher";
    var libs = [
        "js/client/basic",
        "js/client/connector"
    ];
    define(name, libs, function () {
        var basic = require("js/client/basic");
        var connector = require("js/client/connector");
        var counter = 0;
        var dispatcher = basic.inherit({
            constructor: function dispatcher(_options) {
                var options = {};
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);
                this._connector = null;
                this._subscribers = {};
                this._init();
            },
            _init: function () {
                this.start_connector();
            },
            start_connector: function () {
                this._connector = new connector();
                this._connector.on("data", this._on_data.bind(this));
                this._connector.on("closed", this._on_closed.bind(this));
            },
            _on_data: function (_event) {
                var client_id = _event.data.client_id;
                if(_event.data.command == "new_connection"){
                    this.trigger("new_connection", _event);
                } else {
                    this._subscribers[client_id].callback(_event);
                }
            },
            _on_closed: function(_data){
                console.log("socket closed")
            },
            add: function (_callback) {
                var data = new _data({
                    callback: _callback
                });

                var id = counter++;
                this._subscribers[id] = data;
                return id;
            },
            remove: function (_sid) {
                delete this._subscribers[_sid];
            },
            send: function(_id, _data){
                _data.server_id = server.server_id;
                this._connector.send({
                    client_id: _id,
                    data: _data
                });
            }
        });
        var _data = function _data(_opts){
            var opts = {};
            Object.extend(opts, _opts);
            this.data = opts.data;
            this.callback = opts.callback;
        };

        return dispatcher;
    })
})(window);