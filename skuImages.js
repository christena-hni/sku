module.exports = new (function(skuParser, async, views, farmConnector){
    this.one = one;
    this.all = all;
    var baseS7AccountUrl = "http://s7d4.scene7.com/ir/render/AllsteelRender";
    function one(sku, map, size, angle, callback) {
        var options = skuParser.testAndParse(sku, map);
        var view = views.bestView(angle);
        var vignette = options.constants.vignette;
        get(baseS7AccountUrl, vignette, view, options.staticObjects, options.materials, size, "png-alpha", callback);
    }
    function defaultView(sku, size, callback) {
        var view = views.defaultView();
        get(baseS7AccountUrl, options, view, callback);
    }
    function all(sku, map, size, callback) {
        var options = skuParser.testAndParse(sku, map);
        var vignette = options.constants.vignette;
        var allViews = views.allViews();
        async.map(
            allViews,
            function(view, itemCallback) {
                get(baseS7AccountUrl, vignette, view, options.staticObjects, options.materials, size, "png-alpha", itemCallback);
            },
            callback
            );
    }
    function get(baseS7AccountUrl, vignette, view, staticObjects, materials, size, imageType, callback) {
        farmConnector.url(baseS7AccountUrl, vignette, view, staticObjects, materials, size, imageType, callback);
    }
})(require("./skuParser.js"), require("async"), require("./views.js"), require("./farmConnector.js"));
