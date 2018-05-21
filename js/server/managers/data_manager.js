/**
 * Created by Cubla on 10.03.2018.
 */
var basic = require("./../basic");
var fs = require("fs");

var database = basic.inherit({
    constructor: function database(_options) {
        var options = {};
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);
        this.__init();
    },
    __init: function () {
        if (fs.existsSync("db.json")) {
            this.__data = JSON.parse(fs.readFileSync("db.json", "utf8"));
            console.log("db loaded");
        } else {
            this.__data = {};
            console.log("db created new");
        }
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    data: function () {
        return this.__data;
    },
    save: function () {
        fs.writeFileSync("db.json", JSON.stringify(this.__data, true, 3), "utf8");
        console.log("db saved");
    }
});




module.exports = database;