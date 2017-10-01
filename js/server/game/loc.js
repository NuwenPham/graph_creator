var basic = require("./../basic");

var loc = basic.inherit({

    constructor: function location(_opt) {
        var opts = Object.extend({
            row_pos: 0,
            col_pos: 0,
            line_fill: 0xAAAAAA,
            fill: 0x777777,
            hover_fill: 0x778877
        }, _opt);

        this._move_mode = false;

        basic.prototype.constructor.call(this, opts);
        this._init();
    },

    _init: function () {

    },

    id: function () {
        return this._id;
    },

    get: function (_key) {
        return this._opts[_key];
    },

    set: function (_id, _key) {
        this._opts[_id] = _key;
        this.to_draw();
    },

    move_mode: function (_bool) {
        if (_bool === undefined) {
            return this._move_mode;
        }
        this._move_mode = _bool;
    }

});

module.exports = loc;