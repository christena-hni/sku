module.exports = new SkuParser(require("async"), require("./textilesApi.js"));

function SkuParser(async, api) {
    this.testAndParse = testAndParse;

    function testAndParse(sku, map, callback) {
        var expressions = Object.keys(map);
        var found = false;

        expressions.forEach(function(expression) {
            if (!found && new RegExp(expression, "i").test(sku)) {
                parse(sku, map[expression], callback);
                found = true;
            }
        });

        if (!found)
            callback(null, null);
    }

    function parse(sku, skumapItem, cbParse) {
        var properties = {
            constants: skumapItem.constants,
            staticObjects: [],
            materials: []
        };
        var matches = sku.match(new RegExp(skumapItem.pattern, "i"));
        var headers = [];

        skumapItem.headers.forEach(function(header) {
            if (header)
                headers.push(header);
        });

        async.each(headers, function(header, callback) {
            var i = skumapItem.headers.indexOf(header);
            if (header) {
                //i + 1 because match 0 is the whole expression.
                var value = matches[i + 1];
                //if static overlap
                if (/^\^/.test(header)) {
                    //overriding with alias if found
                    if (skumapItem.aliases[header.toUpperCase() + value.toUpperCase()]) {
                        value = skumapItem.aliases[header.toUpperCase() + value.toUpperCase()];
                    }
                    properties.staticObjects.push(value);
                    callback();
                }
                //if materials
                else if (/^#/.test(header)) {
                    var baseName = /\w+/.exec(header).toString();

                    api.getMaterial(value, function(err, material) {
                        if (material) {
                            var objectName = baseName + (material.type === "texture" ? "0" : "1") + (material.light === "matte" ? "0" : "1");
                            var objectValue = material.material;

                            properties.materials.push([objectName, objectValue]);
                            callback();
                        }
                        else {
                            callback();
                        }
                    })
                }
                else {
                    callback();
                }
            }
            else {
                callback();
            }
        }, function(err) {
            cbParse(err, properties);
        })
    }
}
