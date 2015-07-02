var farmConnector = require("../farmConnector.js");
var baseS7AccountUrl = "http://s7d4.scene7.com/ir/render/HONRender";
var vignette = "HIWM3";
var angle = "0030";
var properties = {};
var size = 100;
var imageType = "png-alpha";
farmConnector.url(baseS7AccountUrl, vignette, angle, properties, size, imageType, function(err, url) {
    console.log(url);    
});