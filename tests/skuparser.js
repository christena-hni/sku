var skuProcessor = require("../skuMapProcessor.js");
var files = [__dirname + "/../data/skuMaps/19.skumap"];
var parser = require("../skuParser.js");

skuProcessor.processAll(files, function(err, map) {
    var sku = "A19-HWG.2.P19.DOL719";
    parser.testAndParse(sku, map, function(err, result){
        console.log("erro", err);
        console.log(result);    
    });
});