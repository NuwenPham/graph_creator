/**
 * Created by Cubla on 19.08.2017.
 */
var basic = require("./../basic");
var v_loc = require("./loc");
var point = require("./../types/point");


var field = basic.inherit({
    constructor: function field(_options) {
        var options = {
            rows: 5,
            cols: 5
        };

        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);

        this._empty_field = new point(options.rows - 1, options.cols - 1);
        this._locs = [];

        this._init();
    },

    _init: function () {
        this._locs = {};
    },

    gen_field: function () {
        var row = 0;
        while (row < this._opts.rows) {
            var col = 0;
            while (col < this._opts.cols) {

                if (col == this._empty_field.x && row == this._empty_field.y) {
                    col++;
                    continue;
                }

                this.add_loc(col, row);
                col++;
            }
            row++;
        }
    },

    add_loc: function(_col, _row) {
        var loc = new v_loc({
            row_pos: _row,
            col_pos: _col,
            line_fill: 0xAAAAAA,
            fill: 0x777777,
            hover_fill: 0x778877
        });

        this._locs[_row] = this._locs[_row] == undefined ? {} : this._locs[_row];
        this._locs[_row][_col] = loc;

        //this._locs.push(loc);
    },

    set_pos: function (_col, _row) {
        var loc_model = this._locs[_row][_col];

        var from_col_pos = loc_model.get("col_pos");
        var from_row_pos = loc_model.get("row_pos");

        var to_col_pos = _col;
        var to_row_pos = _row;

        var hor = Math.abs(from_col_pos - this._empty_field.x);
        var ver = Math.abs(from_row_pos - this._empty_field.y);

        var is_shot = to_row_pos == this._empty_field.y && to_col_pos == this._empty_field.x;
        var is_close = hor <= 1 && ver <= 1;
        var is_half_dead_mutherfucker_no_name_variable = (ver + hor) / 2 == 0.5;

        var is_success = is_shot && is_close && is_half_dead_mutherfucker_no_name_variable;

        if(!is_success){
            return {
                success: is_success,
                message: "error loc_pos"
            }
        }

        loc_model.set("col_pos", to_col_pos);
        loc_model.set("row_pos", to_row_pos);

        return {
            success: is_success
        }
    }

});

module.exports = field;