module.exports = new(function(req) {
    var _apiUrl = "http://qa-tf.azurewebsites.net/allsteel/details/#code#/scene7";

    this.getMaterial = function(code, callback) {
        var url = _apiUrl.replace(/#code#/g, code);
        req.get(url, function(err, res, body) {
            callback(err, JSON.parse(body));
        });
    }
})(require("request"));