/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var libs = [
        "js/basic"
    ];
    define(libs, function(){
        var basic = requirejs("js/basic");
        return basic.inherit({
            constructor: function user(_opt){
                var opts = Object.extend({

                }, _opt);

                basic.prototype.constructor.call(this, opts);

                this._loc_id = 0;
                this._game_id = 0;
                this._type = 0;
                this._position = new v.point(0,0);
                this._name = "";
            }
        });
    });
})(window);