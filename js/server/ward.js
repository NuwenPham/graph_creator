var basic = require("./basic");
var promise = require("./utils/promise");
var dispatcher = require("./utils/dispatcher.js");
var connection_manager = require("./managers/connection_manager.js");

var games = {};
global.games = games;



var ward = basic.inherit({
    constructor: function ward(_options) {
        var options = {};
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);
        this.__init();
    },

    destructor: function () {
        basic.prototype.destructor.call(this);
    },

    __init: function () {
        this.__init_dispatcher();
        this.__init_connection_manager();
    },

    __init_dispatcher: function () {
        this.__dispatcher = new dispatcher();
    },

    __init_connection_manager: function () {
        this.__connection_manager = new connection_manager();
    },

    dispatcher: function () {
        return this.__dispatcher;
    },

    connection_manager: function () {
        return this.__connection_manager;
    }

});

module.exports = ward;