var config = {
    product: {
        version: 0, // will not update untill pre beta state
        state: "pre beta",
        name: "mapper"
    },
    /**
     * this part can be found in eve development site https://developers.eveonline.com/resource/resources
     * sorry for english:
     * just sign in on this site
     * create an application
     *
     * set this access scopes:
     *     esi-location.read_location.v1
     *     esi-location.read_ship_type.v1
     *     esi-clones.read_clones.v1
     *     esi-universe.read_structures.v1
     *     esi-location.read_online.v1
     *
     * copy and paste Client ID into client_id
     * copy and paste Secret Key into secret_key
     */
    eve_application_data: {
        client_id: "804ba189451a4b12af36a1f770d9a12d",
        secret_key: "ycOmcLziPYTsCydxIxAgdhEsILr7hzRAgMKCzQBu"
    },
    eve_esi_server: {
        host: "esi.evetech.net",
        proto: "http:", // protocol http/https
        port: 443,
        server: "tranquility", // this parameter may not work correct
        content_type: "application/json"
    },
    eve_sso_server:  {
        host: "login.eveonline.com", // login server
        proto: "https:", // protocol
        content_type: "application/x-www-form-urlencoded"
    },
    server_listener: {
        port: 1400
    },
    /**
     * this setting must be corrected
     */
    poll_settings: {
        count_requests_by_tick: 5, // how many request will get from queue and send in one moment
        timeout: 900 // delay between requests
    },
    errors: {
        CHAR_ERROR: "CHAR_ERROR",
        ATTACH_FAILED: "ATTACH_FAILED",
        CCP_DATA_FAILED: "CCP_DATA_FAILED",
        CCP_AUTH_FAILED: "CCP_AUTH_FAILED",
        BAD_TOKEN: "BAD_TOKEN",
        USER_NOT_EXIST: "USER_NOT_EXIST",
        SHORTER_PASSWORD: "SHORTER_PASSWORD",
        INVALID_MAIL: "INVALID_MAIL",
        PASSWORDS_NOT_MATCH: "PASSWORDS_NOT_MATCH",
        PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
        ALREADY_EXIST: "ALREADY_EXIST",
        UNKNOWN: "UNKNOWN",
        ACCOUNT_DATA_ERROR: "ACCOUNT_DATA_ERROR",
        BAD_CCP_REFRESH_TOKEN: "BAD_CCP_REFRESH_TOKEN",
        WRONG_DATA: "WRONG_DATA",
        WRONG_LOCATION: "WRONG_LOCATION",
        WRONG_SYSTEM_ID: "WRONG_SYSTEM_ID"
    }
};

module.exports = config;