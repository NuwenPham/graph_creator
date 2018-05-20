/**
 * Created by Cubla on 10.03.2018.
 */
var basic = require("./../basic");
var fs = require("fs");

var eve_static_data = basic.inherit({
    constructor: function database(_options) {
        var options = {};
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);

        this.__init();
    },
    __init: function () {
        if (fs.existsSync("./eve_data/solar_systems_data.json")) {
            this.__data = JSON.parse(fs.readFileSync("./eve_data/solar_systems_data.json", "utf8"));
            console.log("eve_static_data loaded");
        } else {
            this.__data = {
                systems: {}
            };
            console.log("eve_static_data doesn't exist");
        }
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    get_system: function(_solar_system_id){
        return this.__data.systems[_solar_system_id]
    }
});




module.exports = eve_static_data;