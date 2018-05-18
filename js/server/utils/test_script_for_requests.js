/**
 * Created by Cubla on 18.05.2018.
 */
var esi = require("./esi.js");


var request = function () {
    esi.alliance.get("99007044", function (_data, _body, _req) {
        // count++;
        // console.log(count);
    });
};

var a = 0;
var end = 20000;
var req = function () {
    if( a < end){
        request();
        setTimeout(req, 1);
        a++;
    }
};
req();

