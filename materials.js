module.exports = new (function(){
    var materials = {
        "bu": { light: "01", material: "#9AbaB7", name: "Surf" },
        "bw": { light: "01", material: "#4a403A", name: "Browstone" },
        "cb": { light: "02", material: "#1E1E1C", name: "Onyx"  },
        "gn": { light: "01", material: "#9E9645", name: "Sprout" },
        "gy": { light: "01", material: "#a5ADA0", name: "Summit" },
        "rd": { light: "01", material: "#710D0f", name: "Cayenne" },
        "rg": { light: "01", material: "#c14F15", name: "Tangelo" },
        "wt": { light: "01", material: "#d0cDc8", name: "Frost" },
        "twht": { light: "03", material: "#F0EDE8", name: "Milky White" },
        "b": { light: "01", material: "#232323", name: "Black" },
        "s": { light: "01", material: "#a0a09e", name: "Silver" },
        "atr005": { light: "01", material: "is{hnicorprender/maharam-alter-glen}&res=182" },
        "dol719": { light: "11", material: "#c33217" }
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