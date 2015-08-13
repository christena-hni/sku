var Converter = require("csvtojson").Converter;
var fs = require("fs");
var _ = require("underscore");
var converter = new Converter();

var fileName = "./materials.csv";

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
  return (this.Supplier + "_" + this.FabricPattern + "_" + this.FabricColor).toLowerCase();
};

converter.on("end_parsed", function(json) {
  for(var i = 0;i < json.length;i++) {
    json[i].isFabric = isFabric;
    json[i].isLeather = isLeather;
    json[i].hasMaterial = hasMaterial;
    json[i].hasMaterial = hasMaterial;
    json[i].material = material;
    json[i].name = name;
  };

  var materials = {};
  var itemsWithMaterial = _.filter(json, function(item) { return item.hasMaterial(); });

  _.each(itemsWithMaterial, function(item) {
    if(item.AllsteelCode != null && item.AllsteelCode != undefined && item.AllsteelCode != "") {
      materials[item.AllsteelCode] = { light: "01", material: item.material(), name: item.name() };
    }

    if(item.HONCode != null && item.HONCode != undefined && item.HONCode != "") {
      materials[item.HONCode] = { light: "01", material: item.material(), name: item.name() };
    }
  });

  console.log(JSON.stringify(materials));

  fs.writeFile("materials.json", JSON.stringify(materials), function(err) {
    if(err) {
        return console.log(err);
    };

    console.log("materials.json saved")
  });
});

fs.createReadStream(fileName).pipe(converter);
