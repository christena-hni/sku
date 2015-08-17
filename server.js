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
var skus = _.map(["seek.skumap", "19.skumap", "nimble-polished.skumap", "nimble-powdercoat.skumap"], function (sku) {
    return path.join(baseSkuMapsDirectory, sku);
});

skuMapProcessor.processAll(skus, function (err, map) {
    if (err) {
        console.log(err);
    }
    else {
        var app = express();
        var server = http.createServer(app);

        app.use(express.static(path.resolve(__dirname, 'client')));
        app.use('/bower_components', express.static(__dirname + '/bower_components'));
        app.use('/polymers', express.static(__dirname + '/polymers'));

        app.set('view engine', 'jade');

        server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
            var addr = server.address();
            console.log("Product image API server listening at", addr.address + ":" + addr.port);
        });

        app.get("/breakdown/:sku", function (req, res) {
            var properties = skuParser.testAndParse(req.params.sku, map);
            console.log(properties);
            res.json(properties);
        });

        app.get("/url/:sku/:size/all", function (req, res) {
            var sku = req.params.sku;
            var properties = skuParser.testAndParse(sku, map);
            var size = req.params.size;
            skuImages.all(sku, map, size, function (err, urls) {
                res.json({
                    urls: urls
                });
            });
        });

        app.get("/page/:sku/:size/all", function (req, res) {
            var sku = req.params.sku;
            var properties = skuParser.testAndParse(sku, map);
            var size = req.params.size;
            skuImages.all(sku, map, size, function (err, urls) {
                res.render("allviews", {
                    urls: urls
                });
            });
        });

        app.get("/url/:sku/:size/:angle", function (req, res) {
            var sku = req.params.sku;
            var properties = skuParser.testAndParse(sku, map);
            var size = req.params.size;
            var angle = req.params.angle;
            skuImages.one(sku, map, size, angle, function (err, view) {
                res.json({
                    url: view.url
                });
            });
        });

        app.get('/', function (req, res) {
            res.render('index', { title: 'All Products', products: [{ name: "#19" }, { name: "Acuity" }] });
        });

        // Public API Methods

        // Examples:
        // /api/products/A19-HWG.2.P19.DOL719 - Returns image with default angle and size
        // /api/products/A19-HWG.2.P19.DOL719?size=1200&angle=0030 - Returns image with specified angle and custom size
        app.get("/api/products/:sku", function (req, res) {
            var sku = req.params.sku;
            var properties = skuParser.testAndParse(sku, map);
            //optional querystring parameter
            var size = req.query.size;
            //optional querystring parameter
            var angle = req.query.angle;

            skuImages.one(sku, map, size, angle, function (err, url) {
                res.json({ url: url });
            });
        });

        // Examples:
        // /api/products/A19-HWG.2.P19.DOL719/all - Returns an array with images of all angles and default size
        // /api/products/A19-HWG.2.P19.DOL719?size=1200- Returns an array with images of all angles and custom size
        app.get("/api/products/:sku/all", function (req, res) {
            var sku = req.params.sku;
            var properties = skuParser.testAndParse(sku, map);
            var size = req.query.size;

            skuImages.all(sku, map, size, function (err, urls) {
                res.json(urls);
            });
        });
    }
});
