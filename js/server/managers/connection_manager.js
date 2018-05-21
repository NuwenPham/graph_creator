/**
 * Created by Cubla on 20.09.2017.
 */

var basic = require("./../basic");

var connection_manager = basic.inherit({
    constructor: function connection_manager(_options) {
        var options = {};
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);

        this.__connections = {};
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    add: function (_connection_id, _value) {
        this.__connections[_connection_id] = _value || Object.create(null);
    },
    get: function (_connection_id) {
        return this.__connections[_connection_id];
    },
    is_exist: function (_connection_id) {
        return this.__connections[_connection_id] !== undefined;
    },
    remove: function (_connection_id) {
        delete this.__connections[_connection_id];
    }
});

module.exports = connection_manager;