/**
 * Created by Cubla on 20.09.2017.
 */

var levelup = require('level');


var basic = require("./../basic");

var leveldb = basic.inherit({
    constructor: function (_options) {
        var options = {
            db_set_mode: "json",
            db_path: "./my_db.level"
        };
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);
        this.__init();
    },

    destructor: function () {
        this.close();
        basic.prototype.destructor.call(this);
    },

    __init: function () {
        this.open();
    },

    open: function () {
        this.__db_handle = levelup(this._opts.db_path);
    },

    close: function () {
        this.__db_handle.close();
    },

    get: function (_key) {
        var pr = new promise();
        this.__db_handle.get(_key, function (_err, _value) {
            if (_err) {
                pr.reject(_err);
            } else {
                var value = this._opts.db_set_mode == "json" ? JSON.parse(_value) : _value;
                pr.resolve(value);
            }
        }.bind(this));
        return pr.native;
    },

    set: function (_key, _value) {
        var pr = new promise();
        if (this._opts.db_set_mode == "json") {
            return this.__db_handle.put(_key, JSON.stringify(_value), function (_err) {
                if (_err) {
                    pr.reject(_err);
                } else {
                    pr.resolve();
                }
            }.bind(this))
        }
        return pr.native;
    },

    remove: function (_key) {
        var pr = new promise();
        this.__db_handle.del(_key, function (_err) {
            if (_err) {
                pr.reject(_err);
            } else {
                pr.resolve();
            }
        }.bind(this));
        return pr.native;
    }

});

module.exports = leveldb;