/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var libs = [
        "js/basic"
    ];
    define(libs, function(){
        var basic = requirejs("js/basic");

        var portal = basic.inherit({
            constructor: function portal(_opt){
                var opts = Object.extend({

                }, _opt);

                basic.prototype.constructor.call(this, opts);

                this._loc_id_from = 0;
                this._loc_id_to = 0;
                this._from_side = 0;
                this._to_side = 0;
            }
        });

        Object.extend(portal, {
            LEFT: 0,
            RIGHT: 1,
            UP: 2,
            DOWN: 3
        });
        return portal;
    });
})(window);