var fs = require("fs");
var _ = require("underscore");

module.exports = new (function(){
    var textiles = JSON.parse(fs.readFileSync('./data/textiles.json', 'utf8'));
    var materials = JSON.parse(fs.readFileSync('./data/materials.json', 'utf8'));

    //Merging both materials loaded from disk
    for(var prop in textiles) {
      if(textiles.hasOwnProperty(prop)) {
        materials[prop] = textiles[prop];
      }
    }

    this.getOption = getOption;
    this.has = has;
    function getOption(name, value) {
        value = value.toUpperCase();
        return [
            name + materials[value].light,
            materials[value].material
        ];
    }

    function has(value) {
        value = value.toUpperCase();
        return materials[value];
    }
})();
