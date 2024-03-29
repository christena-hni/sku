var http = require('http'),
    path = require('path'),
    async = require('async'),
    express = require('express'),
    cors = require("cors");
    glob = require("glob");

var skuMapProcessor = require('./skuMapProcessor.js'),
    skuParser = require("./skuParser.js"),
    skuImages = require("./skuImages.js");

var skus = glob.sync(__dirname + "/data/skuMaps/*.skumap");
console.log("Maps loaded", skus);

skuMapProcessor.processAll(skus, function(err, map) {
    if (err) {
        console.log(err);
    }
    else {
        var app = express();
        var server = http.createServer(app);

        app.use(express.static(path.resolve(__dirname, 'client')));
        app.use(cors());

        app.set('view engine', 'jade');

        server.listen(process.env.PORT || 3001, process.env.IP || "0.0.0.0", function() {
            var addr = server.address();
            console.log("Product image API server listening at", addr.address + ":" + addr.port);
        });

        app.get("/breakdown/:sku", function(req, res) {
            skuParser.testAndParse(req.params.sku, map, function(err, properties) {
                if (err) {
                    res.json(err);
                    return;
                }

                res.json(properties);
            });
        });

        app.get("/url/:sku/:size/all", function(req, res) {
            var sku = req.params.sku;
            skuParser.testAndParse(sku, map, function(properties) {
                if (err) {
                    res.json(err);
                    return;
                }

                var size = req.params.size;
                skuImages.all(sku, map, size, function(err, urls) {
                    res.json({
                        urls: urls
                    });
                });
            });

        });

        app.get("/page/:sku/:size/all", function(req, res) {
            var sku = req.params.sku;
            skuParser.testAndParse(sku, map, function(err, properties) {
                if (err) {
                    res.json(err);
                    return;
                }

                var size = req.params.size;
                skuImages.all(sku, map, size, function(err, urls) {
                    res.render("allviews", {
                        urls: urls
                    });
                });
            });
        });

        app.get("/url/:sku/:size/:angle", function(req, res) {
            var sku = req.params.sku;
            skuParser.testAndParse(sku, map, function(err, properties) {
                if (err) {
                    res.json(err);
                    return;
                }

                var size = req.params.size;
                var angle = req.params.angle;
                skuImages.one(sku, map, size, angle, function(err, view) {
                    res.json({
                        url: view.url
                    });
                });
            });

        });

        app.get('/', function(req, res) {
            res.render('index', {
                title: 'All Products',
                products: [{
                    name: "#19"
                }, {
                    name: "Acuity"
                }]
            });
        });

        // Public API Methods

        // Examples:
        // /api/products/A19-HWG.2.P19.DOL719 - Returns image with default angle and size
        // /api/products/A19-HWG.2.P19.DOL719?size=1200&angle=0030 - Returns image with specified angle and custom size
        app.get("/api/products/:sku", function(req, res) {
            var sku = req.params.sku;
            skuParser.testAndParse(sku, map, function(err, properties) {
                if (err) {
                    res.json(err);
                    return;
                }

                //optional querystring parameter
                var size = req.query.size;
                //optional querystring parameter
                var angle = req.query.angle;

                skuImages.one(sku, map, size, angle, function(err, url) {
                    res.json({
                        url: url
                    });
                });
            });

        });

        // Examples:
        // /api/products/A19-HWG.2.P19.DOL719/all - Returns an array with images of all angles and default size
        // /api/products/A19-HWG.2.P19.DOL719?size=1200- Returns an array with images of all angles and custom size
        app.get("/api/products/:sku/all", function(req, res) {
            console.log("chegou");
            var sku = req.params.sku;
            skuParser.testAndParse(sku, map, function(err, properties) {
                if (err) {
                    res.json(err);
                    return;
                }

                var size = req.query.size;

                skuImages.all(sku, map, size, function(err, urls) {
                    res.json(urls);
                });
            });
        });
    }
});
