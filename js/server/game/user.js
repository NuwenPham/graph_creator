/**
 * Created by Cubla on 10.08.2017.
 */
var basic = require("./../basic");

global.game_counter = 0;

var user = basic.inherit({
    constructor: function user(_options) {
        var options = {
            role: user.SLAVE
        };

        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);
        this._init();
    },

    _init: function () {
        this._id = this._opts.connection_id;
        this._role = this._opts.role;
    },

    get_id: function(){
        return this._id;
    }
});

Object.extend(user,{
    GOD : 0,
    SLAVE: 1
});

module.exports = user;