/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var libs = [
        "js/basic",
        "js/models/game"
    ];
    define(libs, function(){
        var basic = requirejs("js/basic");
        var game = requirejs("js/models/game");
        return basic.inherit({
            constructor: function main(_opt){
                var opts = Object.extend({

                }, _opt);

                basic.prototype.constructor.call(this, opts);

                this._games = [];
            }
        });
    });
})(window);