/**
 * Created by Cubla on 03.12.2017.
 */
module.exports = {
    auth: require("./requests/auth").requests,
    user: require("./requests/user").requests,
    mapper: require("./requests/mapper").requests
};