/**
 * Created by pham on 8/8/17.
 */
var WebSocketServer = require('websocket').server;
var http = require('http');
var basic = require('./../basic.js');

var connector = basic.inherit({
    constructor: function connector(_options) {
        var options = {
            port: 1400
        };

        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);
        this._init();
    },

    _init: function () {
        this._port = this._opts.port;

        this._counter = 0;
        this._connections = {};

        this.create_socket();
    },

    create_socket: function () {
        this._server = http.createServer(function(request, response) {
            // хз че тут
        });

        this._server.listen(1400, function() { });

        this._wsServer = new WebSocketServer({
            httpServer: this._server
        });

        this._wsServer.on('request', this._on_request.bind(this));
    },

    _on_close: function(_connection_id, _connection){
        // член
        console.log("close CHLEN:\n");
        this.trigger("closed", {reason: "clen"});
    },

    _on_message: function(_connection_id, _message){
        if (_message.type === 'utf8') {
             console.log("IN:\n" + _message.utf8Data.toString());
            this.trigger("data", JSON.parse(_message.utf8Data));
        }
    },

    _on_request: function(_request){
        var connection = _request.accept(null, _request.origin);

        // здесь точно чего-нибудь недостает :DD
        connection.on('message', this._on_message.bind(this, this._counter));
        connection.on('close', this._on_close.bind(this, this._counter));
        this._connections[this._counter] = connection;

        this.trigger("new_connection", this._counter );
        this._counter++;
    },

    send: function(_connection_id, _data) {
        var connection = this._connections[_connection_id];
        var str = JSON.stringify(_data);
        console.log("OUT:\n" + str);
        connection.send(str);
    }
});

module.exports = connector;