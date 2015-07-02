module.exports = new SkuParser();
function SkuParser(){
    this.testAndParse = testAndParse;
    function testAndParse(sku, map) {
        var expressions = Object.keys(map);
        for (var i = 0; i < expressions.length; i++) {
            var expression = expressions[i];
            if(new RegExp(expression).test(sku)){
                var result = parse(sku, map[expression]);
                return result;
            }
        }
        return null;
    }
    
    function parse(sku, skumapItem) {
        var properties = skumapItem.constants;
        var matches = sku.match(new RegExp(skumapItem.pattern));
        for (var i = 0; i < skumapItem.headers.length; i++) {
            var header = skumapItem.headers[i];
            if(header) {
                //i + 1 because match 0 is the whole expression.
                properties[header] = matches[i + 1];
            }
        }
        return properties;
    }
}