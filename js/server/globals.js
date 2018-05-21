var _promise = require("./utils/promise.js");
var _ward = require("./ward.js");
var _request_system = require("./utils/request_system");

global.promise = _promise;
global.rsys = new _request_system();

global.ward = new _ward();
global.ward.__init();