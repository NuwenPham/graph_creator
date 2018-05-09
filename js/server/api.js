/**
 * Created by Cubla on 03.12.2017.
 */
module.exports = {
    auth: require("./requests/auth").requests,
    ccp: require("./requests/ccp").requests,
    user: require("./requests/user").requests,
    mapper: require("./requests/mapper").requests,
};