module.exports = new (function(skuParser, async, views, farmConnector){
    var baseS7AccountUrl = "http://s7d4.scene7.com/ir/render/AllsteelRender";
    var defaultSize = 600;
    var defaultImageFormat = "png-alpha";

    this.one = one;
    this.all = all;

    function one(sku, map, size, angle, callback) {
        var options = skuParser.testAndParse(sku, map);
        var view = angle != null ? views.bestView(angle) : views.defaultView();
        var vignette = options.constants.vignette;
        size = size != null ? size : defaultSize;

        get(baseS7AccountUrl, vignette, view, options.staticObjects, options.materials, size, defaultImageFormat, callback);
    };

    function all(sku, map, size, callback) {
        var options = skuParser.testAndParse(sku, map);
        var vignette = options.constants.vignette;
        var allViews = views.allViews();
        var size = size != null ? size : defaultSize;

        async.map(
            allViews,
            function(view, itemCallback) {
                get(baseS7AccountUrl, vignette, view, options.staticObjects, options.materials, size, defaultImageFormat, itemCallback);
            },
            callback
        );
    };

    function get(baseS7AccountUrl, vignette, view, staticObjects, materials, size, imageType, callback) {
        farmConnector.url(baseS7AccountUrl, vignette, view, staticObjects, materials, size, imageType, callback);
    };
})(require("./skuParser.js"), require("async"), require("./views.js"), require("./farmConnector.js"));
