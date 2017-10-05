/**
 * Created by pham on 8/8/17.
 */

var basic = require("./../basic.js");
var connector = require("./connector.js");

var counter = 0;

var dispatcher = basic.inherit({
    constructor: function dispatcher(_options) {
        var options = {

        };
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
        this._connector.on("new_connection", this._on_new_connection.bind(this));
    },

    _on_data: function (_event) {
        var server_id = _event.data.server_id;
        this._subscribers[server_id].callback(_event);
        // debugger;
    },

    _on_new_connection: function (_connection_id) {
        var id = this.add(function (_data) {
            this.trigger("enter_point", {connection_id: _connection_id, data:_data});
        }.bind(this));

        this.send(_connection_id, id, {command: "new_connection"})
    },

    _on_closed: function(_data){
        debugger;
    },

    add: function (_callback) {
        var data = new _data({
            callback: _callback
        });

        var id = counter++;
        this._subscribers[id] = data;
        return id;
    },

    send: function(_connection_id, _server_id, _data){
        var result_obj = {
            server_id: _server_id,
            data: _data
        };
        this._connector.send(_connection_id, result_obj);
    }
});

var _data = function _data(_opts){
    var opts = {};
    Object.extend(opts, _opts);

    this.data = opts.data;
    this.callback = opts.callback;
};

module.exports = dispatcher;