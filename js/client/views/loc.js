/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var name = "js/client/views/loc";

    var libs = [
        "js/basic",
        "js/models/portal"
    ];
    define(name, libs, function(){
        var counter = 0;
        var basic = requirejs("js/basic");
        var portal = requirejs("js/models/portal");
        return basic.inherit({

            constructor: function location(_opt) {
                var opts = Object.extend({
                    width: 20,
                    height: 20,
                    row_pos: 0,
                    col_pos: 0,
                    x: 0,
                    y: 0,
                    line_fill: 0xAAAAAA,
                    fill: 0x777777,
                    hover_fill: 0x778877
                }, _opt);

                this._id = counter++;
                this._move_mode = false;

                basic.prototype.constructor.call(this, opts);
                this._init();
            },

            _init: function () {
                this._actions = {
                    on_mouse_up: this._on_mouse_up.bind(this),
                    on_mouse_move: this._on_mouse_move.bind(this)
                }

                this._rectangle = new PIXI.Graphics();
                this._rectangle.buttonMode = true;
                this._rectangle.interactive = true;
                this._rectangle.on("mousedown", this._on_mouse_down.bind(this));
                //_export.addEventListener("mousemove", this._on_mouse_move.bind(this));
                //this._rectangle.on("mouseup", this._on_mouse_up.bind(this));

            },

            to_draw: function () {
                if (!this._move_mode) {
                    this._opts.x = (this._opts.width) * this._opts.col_pos + 1;
                    this._opts.y = (this._opts.height) * this._opts.row_pos + 1;
                }
                this._rectangle.clear();
                this._rectangle.beginFill(this._opts.fill);
                this._rectangle.lineStyle(1, this._opts.line_fill, 1);
                this._rectangle.drawRect(this._opts.x, this._opts.y, this._opts.width - 2, this._opts.height - 2);
                this._rectangle.endFill();
            },

            _on_mouse_down: function (_event) {
                if(this.move_mode() == true) return;

                this.move_mode(true);
                _export.addEventListener("mousemove", this._actions.on_mouse_move);
                _export.addEventListener("mouseup", this._actions.on_mouse_up);

                this._started_mouse_coords = new v.point(_event.data.originalEvent.clientX, _event.data.originalEvent.clientY);
                this._started_pos_coords = new v.point(this._opts.x, this._opts.y);
                //debugger;


                this.to_draw();

                this.trigger("down", {
                    owner: this,
                    event: _event
                });
            },

            _on_mouse_up: function (_event) {
                this.move_mode(false);

                //this._rectangle.zOrder = 0;

                var current_coords = new v.point(_event.clientX, _event.clientY);
                var delta = current_coords.subtraction(this._started_mouse_coords);
                this._opts.x = this._started_pos_coords.x + delta.x;
                this._opts.y = this._started_pos_coords.y + delta.y;

                this.to_draw();
                _export.removeEventListener("mousemove", this._actions.on_mouse_move);
                _export.removeEventListener("mouseup", this._actions.on_mouse_up);

                this.trigger("up", {
                    owner: this,
                    event: _event,
                    x: this._opts.x,
                    y: this._opts.y
                });
            },

            _on_mouse_move: function (_event) {
                var current_coords = new v.point(_event.clientX, _event.clientY);
                var delta = current_coords.subtraction(this._started_mouse_coords);
                this._opts.x = this._started_pos_coords.x + delta.x;
                this._opts.y = this._started_pos_coords.y + delta.y;

                //debugger;
                this.to_draw();
                this.trigger("move", {
                    owner: this,
                    event: _event
                });
            },

            graphics: function () {
                return this._rectangle;
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

            grapics: function () {
                return this._rectangle;
            },

            move_mode: function (_bool) {
                if (_bool === undefined) {
                    return this._move_mode;
                }
                this._move_mode = _bool;
            }

        });
    });
})(window);