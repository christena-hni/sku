module.exports = new SkuMapProcessor(require("fs"), require("async"));

function SkuMapProcessor(fs, async) {
    var variables = {
        "fabric": "[a-zA-Z]+[0-9]+",
        "nothing": ""
    };
    
    this.processAll = processAll;
    
    function processAll(files, callback) {

        async.map(
            files,
            function(file, callback) {
                fs.readFile(file, 'utf8', function(err, text){
                    if(err) {
                        callback(err, null);
                        return;
                    }
                    var mapItem = process(text);
                    callback(null, mapItem)
                })
            },
            function(err, results){
                var skuMap = [];
                results.forEach(function(result) {
                    skuMap[result.pattern] = result;
                })
                callback(err, skuMap);
            }
        );
        
        
    }
    
    function process(text) {
        var skuParts = [];
        var headers = [];
        var constants = {};
        var lines = text.toString().split('\n');
        lines.forEach(function(line){
            processLine(line, skuParts, headers, constants); 
        });
        var pattern = buildPattern(skuParts);
        return {
            headers: headers,
            pattern: pattern,
            constants: constants
        }
    }
    
    function countTabs(line) {
        var matches = line.match(/\t/g);
        if(!matches) { return 0; }
        return matches.length;
    }
    
    function processLine(line, skuParts, headers, constants) {

        var depth = countTabs(line);
        if(!skuParts[depth]){
            skuParts[depth] = [];
        }
        var text = line.trim();
        //check for comments
        if(/^\-\-/.test(text)){
            //do nothing
        }
        //check if it's option
        else if(/^#|\^/.test(text)) {
            headers[depth] = text;
        } 
        //or constant
        else if(/^\$/.test(text)) {
            parseConstant(text, constants);
        }
        else
        {
            skuParts[depth].push(text);
        }
    }
    
    function parseConstant(text, constants) {
        var key = /^\$[\w]+/.exec(text).toString();
        key = key.replace('$', '');
        
        var value = /[\w\s]+$/.exec(text).toString().trim();
        
        constants[key] = value;
        
    }
    
    function buildPattern(skuParts) {
        var pattern = "^";
        for(var i = 0; i < skuParts.length; i++) {
            var parts = skuParts[i];
            var patternBlock = "";
           
    
            for(var j = 0; j < parts.length; j++) {
                if(j > 0){
                    patternBlock += "|";
                }
                var part = parts[j];
                //variables
                if(isVariable(part)){
                    var variablePattern = getPatternForVariable(part);
                    patternBlock += variablePattern;
                }
                //literals
                else {
                    patternBlock += escapeRegExp(part);
                }
            }
            
            //wrap in parenthesis for capture.
            patternBlock = "(" + patternBlock + ")";
           
    
            pattern += patternBlock;
        };
        pattern += "$";
        return pattern;
    }
    
    function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    
    function isVariable(line) {
        return /\{\w+\}/.test(line);
    }
    
    function getPatternForVariable(line) {
        var variableName = /\w+/.exec(line).toString();
        return variables[variableName];
    }
}