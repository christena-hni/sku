var fs = require("fs")

module.exports = new (function(){
    var materials = JSON.parse(fs.readFileSync('./data/materials.json', 'utf8'));
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
