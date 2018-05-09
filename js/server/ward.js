var basic = require("./basic");
var dispatcher = require("./utils/dispatcher.js");
var connection_manager = require("./managers/connection_manager.js");
var user_manager = require("./managers/user_manager.js");
var map_manager = require("./managers/map_manager.js");
var token_manager = require("./managers/token_manager.js");
var data_manager = require("./managers/data_manager.js");
//var leveldb = require("./utils/leveldb.js");

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
        //this.init();
    },

    destructor: function () {
        basic.prototype.destructor.call(this);
    },

    __init: function () {
        this.__init_data();
        this.__init_token_manager();
        this.__init_users();
        this.__init_maps();
        this.__init_connection_manager();
        this.__init_dispatcher();

        //this.__init_users();
        //this.__users.ready_promise().then(function () {
        //    this.__init_connection_manager();
        //    console.log("platform started");
        //}.bind(this), function () {
        //    // failed
        //    console.log("failed on starting users")
        //}.bind(this));
        this.restore();
    },

    __init_data: function () {
        this.__data_manager = new data_manager();
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


    __init_users: function () {
        this.__users = new user_manager({
            ward: this
        });
    },

    __init_maps: function () {
        this.__maps = new map_manager({
            ward: this
        });
    },

    dispatcher: function () {
        return this.__dispatcher;
    },

    connection_manager: function () {
        return this.__connection_manager;
    },

    users: function(){
        return this.__users;
    },

    tokens: function(){
        return this.__token_manager;
    },

    maps: function(){
        return this.__maps;
    },

    db: function () {
        return this.__data_manager;
    },
    save: function(){
        var data = this.__data_manager.data();
        data.token = this.__token_manager.save();
        data.user_data = this.__users.save();
        data.map_manager = this.__maps.save();
        this.__data_manager.save();
    },
    restore: function () {
        var data = this.__data_manager.data();
        this.__token_manager.restore(data.token);
        this.__users.restore(data.user_data);
        this.__maps.restore(data.map_manager);
    }

});

module.exports = ward;