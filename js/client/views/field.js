/**
 * Created by Cubla on 10.08.2017.
 */
/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/client/views/field";
    var libs = [
        "js/basic",
        "js/client/views/loc"
    ];

    define(name, libs, function () {
        var basic = require("js/basic");
        var v_loc = require("js/client/views/loc");


        var field = basic.inherit({
            constructor: function dispatcher(_options) {
                var options = {
                    field_width: 300,
                    field_height: 300,
                    rows: 5,
                    cols: 5
                };
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);

                this._empty_field = new v.point(options.rows - 1, options.cols - 1);
                this._is_ready_to_render = true;
                this._locs = [];
                this._init();

            },

            _init: function () {
                this._start_pixi();
                this.gen_field();
            },

            _start_pixi: function(){
                this._renderer = PIXI.autoDetectRenderer(this._opts.field_width, this._opts.field_height);
                this._renderer.view.style.background = "rgba(255,0,0,1)";
                //document.body.appendChild(this._renderer.view);

                this._stage = new PIXI.Container();
                this._stage.intercative = true;
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

            add_loc: function(_col, _row){
                var s_hor = this._opts.field_width / this._opts.cols;
                var s_vert = this._opts.field_height / this._opts.rows;
                var loc = new v_loc({
                    width: s_hor,
                    height: s_vert,
                    row_pos: _row,
                    col_pos: _col,
                    line_fill: 0xAAAAAA,
                    fill: 0x777777,
                    hover_fill: 0x778877
                });
                loc.to_draw();
                this._locs.push(loc);
                this._stage.addChild(loc.graphics());
                this._renderer.render(this._stage);

                loc.on("move", this._on_loc_move.bind(this));
                loc.on("down", this._on_loc_down.bind(this));
                loc.on("up", this._on_loc_up.bind(this));
            },

            _on_loc_down: function (_data) {
                var loc = _data.owner;
                console.log(this._opts.rows * loc.get("row_pos") + loc.get("col_pos") - 1);

                var event = _data.event;
                this._stage.setChildIndex(loc.graphics(), this._locs.length - 1);
                this.render();
            },

            _on_loc_move: function (_data) {
                var loc = _data.owner;
                var event = _data.event;
                this.render();
            },

            _on_loc_up: function (_data) {

                var loc = _data.owner;
                var event = _data.event;

                console.log(this._opts.rows * loc.get("row_pos") + loc.get("col_pos") - 1);
                var col_pos = (event.x - (event.x % loc.get("width"))) / loc.get("width");
                var row_pos = (event.y - (event.y % loc.get("height"))) / loc.get("height");

                if (this.check_pos(loc, event)) {
                    //debugger;
                    this._empty_field.x = loc.get("col_pos");
                    this._empty_field.y = loc.get("row_pos");
                    loc.set("row_pos", row_pos);
                    loc.set("col_pos", col_pos);
                }

                var index = this._opts.rows * loc.get("row_pos") + loc.get("col_pos");
                if (index < 0) index = 0;
                if (index > this._locs.length - 1) index = this._locs.length - 1;

                this._stage.setChildIndex(loc.graphics(), index);
                this.render();
            },

            check_pos: function (loc, event) {
                console.log(this._opts.rows * loc.get("row_pos") + loc.get("col_pos") - 1);

                var col_pos = (event.x - (event.x % loc.get("width"))) / loc.get("width");
                var row_pos = (event.y - (event.y % loc.get("height"))) / loc.get("height");

                var hor = Math.abs(loc.get("col_pos") - this._empty_field.x);
                var ver = Math.abs(loc.get("row_pos") - this._empty_field.y);

                var is_shot = row_pos == this._empty_field.y && col_pos == this._empty_field.x;
                var is_close = hor <= 1 && ver <= 1;
                var is_half_dead_mutherfucker_no_name_variable = (ver + hor) / 2 == 0.5;

                return is_shot && is_close && is_half_dead_mutherfucker_no_name_variable;
            },

            render: function () {
                if (this._is_ready_to_render) {
                    requestAnimationFrame(this._render.bind(this));
                    this._is_ready_to_render = false;
                }
            },

            _render_field: function () {
                var a = 0;
                while( a < this._locs.length ){
                    this._locs[a].to_draw();
                    this._renderer.render(this._stage);
                    a++;
                }
            },

            _render: function () {
                this._render_field();

                this._renderer.render(this._stage);
                this._is_ready_to_render = true;
            }

        });

        var _data = function _data(_opts){
            var opts = {};
            Object.extend(opts, _opts);

            this.data = opts.data;
            this.callback = opts.callback;
        };

        return field;
    })
})(window);