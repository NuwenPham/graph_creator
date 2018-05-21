/**
 * Created by Cubla on 07.08.2017.
 */
// config.js
requirejs.config({
    baseUrl: ""
});

// main.js
require(["js/client/main"], function(){
    require("js/client/main");
});