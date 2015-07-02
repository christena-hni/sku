var farmConnector = require("../farmConnector.js");
var baseS7AccountUrl = "http://s7d4.scene7.com/ir/render/HONRender";
var vignette = "HIWM3";
var view = "0060";
var options = {
    "UP00": "#92a342",
    "ME00": "#151515",
    "back": "M",
    "base": "SB",
    "amrtype": "F"
};
var size = 100;
var imageType = "png-alpha";
farmConnector.url(baseS7AccountUrl, vignette, view, options, size, imageType, function(err, url) {
    console.log(url);    
});