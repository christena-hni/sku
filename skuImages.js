module.exports = new (function(skuParser, async, views, farmConnector){
    this.one = one;
    var baseS7AccountUrl = "http://s7d4.scene7.com/ir/render/HONRender";
    function one(sku, map, size, angle, callback) {
        var options = skuParser.testAndParse(sku, map);
        var view = views.bestView(angle);
        var vignette = options.vignette;
        get(baseS7AccountUrl, vignette, view, options, 400, "png-alpha", callback);
    }
    function defaultView(sku, size, callback) {
        var view = views.defaultView();
        get(baseS7AccountUrl, options, view, callback);
    }
    function all(sku, size, callback) {
        var allViews = views.all();
    }
    function get(baseS7AccountUrl, vignette, view, options, size, imageType, callback) {
        farmConnector.url(baseS7AccountUrl, vignette, view, options, size, imageType, callback);
    }
})(require("./skuParser.js"), require("async"), require("./views.js"), require("./farmConnector.js"));