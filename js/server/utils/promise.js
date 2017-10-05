/**
 * Created by Cubla on 20.09.2017.
 */

var promise = function() {
    this.__resolve = null;
    this.__reject = null;
    this.native = new Promise(function (_resolve, _reject) {
        this.__resolve = _resolve;
        this.__reject = _reject;
    }.bind(this))
};
promise.prototype = {
    resolve: function (_data) {
        this.__resolve(_data);
    },
    reject: function (_data) {
        this.__reject(_data);
    }
};
module.exports = promise;