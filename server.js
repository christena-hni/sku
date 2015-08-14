var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');
var _ = require("underscore");

var skuMapProcessor = require('./skuMapProcessor.js');
var skuParser = require("./skuParser.js");
var skuImages = require("./skuImages.js");
var baseSkuMapsDirectory = "./data/skuMaps/";

//TODO: Scan and load all SKU Maps from the base folder instead of specify each one manually
var skus = _.map(["seek.skumap", "19.skumap", "nimble-polished.skumap", "nimble-powdercoat.skumap"], function(sku) {
  return path.join(baseSkuMapsDirectory, sku);
});

skuMapProcessor.processAll(skus,function(err, map) {
  if(err) {
    console.log(err);
  }
  else {
    var router = express();
    var server = http.createServer(router);

    router.use(express.static(path.resolve(__dirname, 'client')));

    router.set('view engine', 'jade');

    server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
      var addr = server.address();
      console.log("Product image API server listening at", addr.address + ":" + addr.port);
    });

    router.get("/breakdown/:sku", function(req, res) {
      var properties = skuParser.testAndParse(req.params.sku, map);
      console.log(properties);
      res.json(properties);
    });

    router.get("/url/:sku/:size/all", function(req, res) {
      var sku = req.params.sku;
      var properties = skuParser.testAndParse(sku, map);
      var size = req.params.size;
      skuImages.all(sku, map, size, function(err, urls){
        res.json({
          urls: urls
        });
      });
    });

    router.get("/page/:sku/:size/all", function(req, res) {
      var sku = req.params.sku;
      var properties = skuParser.testAndParse(sku, map);
      var size = req.params.size;
      skuImages.all(sku, map, size, function(err, urls){
        res.render("allviews", {
          urls: urls
        });
      });
    });

    router.get("/url/:sku/:size/:angle", function(req, res) {
      var sku = req.params.sku;
      var properties = skuParser.testAndParse(sku, map);
      var size = req.params.size;
      var angle = req.params.angle;
      skuImages.one(sku, map, size, angle, function(err, url){
        res.json({
          url: url
        });
      });
    });

    router.get('/', function (req, res) {
      res.render('index', { title: 'All Products', products: [{ name: "#19" }, { name: "Acuity" }] });
    });

    // router.get('/configurator/:product', function (req, res) {
    //   var file = req.params.product + '.html';
    //   res.sendFile(file, { root: path.join(__dirname, 'views', 'configurator') });
    // });
  }
});
