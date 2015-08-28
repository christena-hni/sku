module.exports = new SkuParser(require("./materials.js"));
function SkuParser(materials){
    this.testAndParse = testAndParse;
    function testAndParse(sku, map) {
        var expressions = Object.keys(map);
        for (var i = 0; i < expressions.length; i++) {
            var expression = expressions[i];
            if(new RegExp(expression, "i").test(sku)){
                var result = parse(sku, map[expression]);
                return result;
            }
        }
        return null;
    }

    function parse(sku, skumapItem) {
        var properties = {
            constants: skumapItem.constants,
            staticObjects: [],
            materials: []
        };
        var matches = sku.match(new RegExp(skumapItem.pattern, "i"));
        for (var i = 0; i < skumapItem.headers.length; i++) {
            var header = skumapItem.headers[i];
            if(header) {
                //i + 1 because match 0 is the whole expression.
                var value = matches[i + 1];
                //if static overlap
                if(/^\^/.test(header)) {
                    //overriding with alias if found
                    if(skumapItem.aliases[header.toUpperCase()+value.toUpperCase()]) {
                      value = skumapItem.aliases[header.toUpperCase()+value.toUpperCase()];
                    }
                    properties.staticObjects.push(value);
                }
                //if materials
                else if(/^#/.test(header)) {
                    var baseName = /\w+/.exec(header).toString();
                    //check if we have that material
                    if(materials.has(value)) {
                        properties.materials.push(materials.getOption(baseName, value));
                    }
                }
            }
        }
        return properties;
    }
}
