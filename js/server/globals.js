var _promise = require("./utils/promise.js");
var _ward = require("./ward.js");

global.promise = _promise;
global.ward = new _ward();

global._CLIENT_ID = "804ba189451a4b12af36a1f770d9a12d";
global._SECRET_KEY = "ycOmcLziPYTsCydxIxAgdhEsILr7hzRAgMKCzQBu";

global._ERROR = {
    ACCOUNT_DATA_ERROR: "ACCOUNT_DATA_ERROR",
    ALREADY_EXIST: "ALREADY_EXIST",
    ATTACH_FAILED: "ATTACH_FAILED",
    BAD_CCP_REFRESH_TOKEN: "BAD_CCP_REFRESH_TOKEN",
    BAD_TOKEN: "BAD_TOKEN",
    CCP_AUTH_FAILED: "CCP_AUTH_FAILED",
    CCP_DATA_FAILED: "CCP_DATA_FAILED",
    CHAR_ERROR: "CHAR_ERROR",
    INVALID_MAIL: "INVALID_MAIL",
    PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
    PASSWORDS_NOT_MATCH: "PASSWORDS_NOT_MATCH",
    SHORTER_PASSWORD: "SHORTER_PASSWORD",
    USER_NOT_EXIST: "USER_NOT_EXIST",
    WRONG_DATA: "WRONG_DATA",
    WRONG_LOCATION: "WRONG_LOCATION",
    WRONG_SYSTEM_ID: "WRONG_SYSTEM_ID",
    UNKNOWN: "UNKNOWN"
};


module.exports = {};