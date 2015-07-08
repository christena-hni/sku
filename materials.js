module.exports = new (function(){
    var materials = {
        "bu": { light: "01", material: "#0000aa" },
        "bw": { light: "01", material: "#00aaaa" },
        "cb": { light: "01", material: "#aa00aa" },
        "gn": { light: "01", material: "#aa0000" },
        "gy": { light: "01", material: "#00aa00" },
        "rd": { light: "01", material: "#aaaaaa" },
        "rg": { light: "01", material: "#00ffaa" },
        "wt": { light: "01", material: "#3300aa" },
        "b": { light: "02", material: "#333333" },
        "s": { light: "03", material: "#aaaaaa" },
        "atr005": { light: "00", material: "is{hnicorprender/maharam-alter-glen}&res=182" }
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