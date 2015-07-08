module.exports = new (function(){
    var materials = {
        "bu": { light: "01", material: "#0000aa" },
        "b": { light: "02", material: "#333333" },
        "s": { light: "03", material: "#aaaaaa" },
    };
    this.getOption = getOption;
    this.has = has;
    function getOption(name, value) {
        return [
            name + materials[value].light,
            materials[value].material
        ];
    }
    
    function has(value) {
        return materials[value];
    }
})();