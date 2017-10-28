var basic = require("./basic");
var promise = require("./utils/promise");
var dispatcher = require("./utils/dispatcher.js");
var connection_manager = require("./managers/connection_manager.js");
var user_manager = require("./managers/user_manager.js");
var token_manager = require("./managers/token_manager.js");
var leveldb = require("./utils/leveldb.js");

var games = {};
global.games = games;


//// example db api
//var db = new leveldb();
//db.set("chlen", { "sadf": 1, "sss": 2, "sdfsd": 3 });
//db.get("chlen").then(function (_data) {
//    console.log(_data);
//},function () {
//    debugger;
//});
//db.remove("chlen");
//db.close();


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
        this.__init_db();
        this.__init_token_manager();
        this.__init_dispatcher();
        this.__init_users();
        this.__users.ready_promise().then(function () {
            this.__init_connection_manager();
            console.log("platform started");
        }.bind(this), function () {
            // failed
            console.log("failed on starting users")
        }.bind(this));
    },

    __init_dispatcher: function () {
        this.__dispatcher = new dispatcher();
    },

    __init_connection_manager: function () {
        this.__connection_manager = new connection_manager();
    },
    __init_token_manager: function () {
        this.__token_manager = new token_manager();
    },

    __init_db: function () {
        this.__db = new leveldb();
    },

    __init_users: function () {
        this.__users = new user_manager({
            ward: this
        });
    },

    dispatcher: function () {
        return this.__dispatcher;
    },

    connection_manager: function () {
        return this.__connection_manager;
    },

    level : function () {
        return this.__db;
    },

    users: function(){
        return this.__users;
    },

    tokens: function(){
        return this.__token_manager;
    }

});

module.exports = ward;