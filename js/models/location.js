/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var libs = [
        "js/basic",
        "js/models/portal"
    ];
    define(libs, function(){
        var counter = 0;
        var basic = requirejs("js/basic");
        var portal = requirejs("js/models/portal");
        return basic.inherit({
            constructor: function location(_opt){
                var opts = Object.extend({

                }, _opt);

                this._id = counter++;
                this._portals = [];
                this._assets = [];
                this._position = new v.point(0,0);


                basic.prototype.constructor.call(this, opts);
            },
            id: function(){
                return this._id;
            }
        });
    });
})(window);