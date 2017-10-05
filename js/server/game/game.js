/**
 * Created by Cubla on 10.08.2017.
 */
var basic = require("./../basic");
var field = require("./field");

global.game_counter = 0;

var game = basic.inherit({
    constructor: function game(_options) {
        var options = {};

        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);
        this._init();
    },

    _init: function () {

        this._id = global.game_counter++;
        this._users = [];
        this._field = new field({

        });

    },

    get_id: function () {
        return this._id;
    },

    add_user: function (_connection_id) {
        var exist = this._users.indexOf(_connection_id) !== -1;

        if (!exist) {
            this._users.push(_connection_id);
            return true;
        }
        return false;
    },

    delete_user: function (_connection_id) {
        var exist = this._users.indexOf(_connection_id) !== -1;

        if (exist) {
            this._users.splice(this._users.indexOf(_connection_id), 1);
            return true;
        }
        return false;
    },

    field: function () {
        return this._field;
    },

    users: function () {
        return this._users;
    }
});

module.exports = game;