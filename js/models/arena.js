/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var libs = [
        "js/basic",
        "js/models/location"
    ];
    define(libs, function(){
        var basic = requirejs("js/basic");
        var location = requirejs("js/models/location");
        return basic.inherit({
            constructor: function arena(_opt){
                var opts = Object.extend({

                }, _opt);

                basic.prototype.constructor.call(this, opts);

                this._locations = [];
                this._rows = 5;
                this._cols = 5;
            }
        });
    });
})(window);