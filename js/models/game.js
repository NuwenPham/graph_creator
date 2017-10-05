/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var libs = [
        "js/basic",
        "js/models/arena"
    ];
    define(libs, function(){
        var basic = requirejs("js/basic");
        var arena = requirejs("js/models/arena");
        return basic.inherit({
            constructor: function game(_opt){
                var opts = Object.extend({

                }, _opt);

                basic.prototype.constructor.call(this, opts);

                this._arena = undefined;
                this._users = [];
            }
        });
    });
})(window);