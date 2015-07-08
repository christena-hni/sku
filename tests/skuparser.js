

var skuProcessor = require("../skuMapProcessor.js");
//var files = ["../19.skumap", "../sum-chair-alum.skumap", "../sum-chair-plastic.skumap", "../sum-stool.skumap", "../hon.skumap"];
var files = ["../seek.skumap"];
skuProcessor.processAll(files, function(err, map) {
    var parser = require("../skuParser.js");
    var sku = "k-mugobfc.bu.0.atr005";
    var result = parser.testAndParse(sku, map);
    console.log(result);
});