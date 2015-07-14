module.exports = new (function(){
    var materials = {
        "BU": { light: "01", material: "#9AbaB7", name: "Surf" },
        "BW": { light: "01", material: "#4a403A", name: "Browstone" },
        "CB": { light: "02", material: "#1E1E1C", name: "Onyx"  },
        "GN": { light: "01", material: "#9E9645", name: "Sprout" },
        "GY": { light: "01", material: "#a5ADA0", name: "Summit" },
        "RD": { light: "01", material: "#710D0f", name: "Cayenne" },
        "RG": { light: "01", material: "#c14F15", name: "Tangelo" },
        "WT": { light: "01", material: "#d0cDc8", name: "Frost" },
        "TWTH": { light: "03", material: "#F0EDE8", name: "Milky White" },
        "B": { light: "01", material: "#232323", name: "Black" },
        "S": { light: "01", material: "#a0a09e", name: "Silver" },
        "P71": { light: "01", material: "#232323", name: "Black" },
        "PR6": { light: "01", material: "#a0a09e", name: "Silver" },
        "SMHMOFF01": { light: "01", material: "is{hnicorprender/maharam-offset-passage}&res=263" },
        "SMHMOFF02": { light: "01", material: "is{hnicorprender/maharam-offset-fieldstone}&res=263" },
        "SMHMOFF03": { light: "01", material: "is{hnicorprender/maharam-offset-coast}&res=263" },
        "SMHMOFF04": { light: "01", material: "is{hnicorprender/maharam-offset-esplanade}&res=263" },
        "SMHMOFF05": { light: "01", material: "is{hnicorprender/maharam-offset-oasis}&res=263" },
        "SMHMOFF06": { light: "01", material: "is{hnicorprender/maharam-offset-spice}&res=263" },
        "SMHMOFF07": { light: "01", material: "is{hnicorprender/maharam-offset-bloom}&res=263" },
        "DOL719": { light: "11", material: "#c33217" }
    };
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