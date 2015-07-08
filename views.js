module.exports = new (function() {
    
    this.bestView = bestView;
    this.allViews = allViews;
    this.defaultView = defaultView;
    
    var angles = [];
    angles[30] = "0030",
    //angles[60] = "0060",
    angles[90] = "0090",
    //angles[120] = "0120",
    //angles[150] = "0150",
    angles[180] = "0180",
    angles[210] = "0210",
    //angles[240] = "0240",
    angles[270] = "0270",
    //angles[300] = "0300",
    //angles[330] = "0330",
    angles[360] = "0000"
    
    var anglesPlusZero = [];
    anglesPlusZero[0] = "0000";
    anglesPlusZero = anglesPlusZero.concat(angles);
    
    function bestView(angle) {
        angle = angle % 360;
        var allKeys = Object.keys(anglesPlusZero);
        var closestAngle = closest(allKeys, angle);
        return anglesPlusZero[closestAngle];
    }
    
    function defaultView() { return allViews()[0]; }
    
    function closest(arr, closestTo){
        var shortestDistance = 360;
        var closest = 0;
        arr.forEach(function(item) {
            var distance = Math.abs(parseInt(item) - parseInt(closestTo));
            if(distance < shortestDistance) {
                shortestDistance = distance;
                closest = parseInt(item);
            }
        });
        return closest;
    }
    
    function allViews() {
        var allViews = [];
        angles.forEach(function(angle) {
            allViews.push(angle);
        });
        return allViews;
    }
})();