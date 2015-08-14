var Converter = require("csvtojson").Converter;
var fs = require("fs");
var _ = require("underscore");
var converter = new Converter();

var fileName = "./textiles.csv";

var isFabric = function() {
  return this.Scene7Name != null && this.Scene7Name != undefined && this.Scene7Name != "";
};

var isLeather = function() {
  return this.RGB != null && this.RGB != undefined && this.RGB != "";
};

var hasMaterial = function() {
  return this.isLeather() || this.isFabric();
};

var material = function() {
  if(this.hasMaterial()) {
    if(this.isFabric()) {
      return "is{hnicorprender/" + this.Scene7Name + "}&res=" + this.Resolution;
    }
    else if(this.isLeather()) {
      return "#" + this.RGB;
    }
  }

  return null;
};

var name = function() {
  return this.Supplier + " " + this.FabricPattern + " " + this.FabricColor;
};

var light = function() {
  if(this.Type === "Fabric") {
    return "01";
  } else if(this.Type === "Leather") {
    return "11";
  } else if(this.Type === "Coded") {
    return "21";
  } else {
    //TODO: Once we get all data right we need to throw an exception here
    //throw new Error(this.Type + " is not a valid type of material");
    return "01";
  }
}

converter.on("end_parsed", function(json) {
  for(var i = 0;i < json.length;i++) {
    json[i].isFabric = isFabric;
    json[i].isLeather = isLeather;
    json[i].hasMaterial = hasMaterial;
    json[i].hasMaterial = hasMaterial;
    json[i].material = material;
    json[i].name = name;
    json[i].light = light;
  };

  var textiles = {};
  var itemsWithMaterial = _.filter(json, function(item) { return item.hasMaterial(); });

  _.each(itemsWithMaterial, function(item) {
    if(item.AllsteelCode != null && item.AllsteelCode != undefined && item.AllsteelCode != "") {
      textiles[item.AllsteelCode] = { light: item.light(), material: item.material(), name: item.name() };
    }

    if(item.HONCode != null && item.HONCode != undefined && item.HONCode != "") {
      textiles[item.HONCode] = { light: item.light(), material: item.material(), name: item.name() };
    }
  });

  fs.writeFile("textiles.json", JSON.stringify(textiles, null, 4), function(err) {
    if(err) {
        return console.log(err);
    };

    console.log("textiles.json saved")
  });
});

fs.createReadStream(fileName).pipe(converter);
