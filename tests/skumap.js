var skuProcessor = require("../skuMapProcessor.js");
//var files = ["../19.skumap", "../sum-chair-alum.skumap", "../sum-chair-plastic.skumap", "../sum-stool.skumap", "../hon.skumap"];
var files = ["../seek.skumap"];
skuProcessor.processAll(files, function(err, map) {
   console.log(err, map); 
});