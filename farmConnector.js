module.exports = new FarmConnector(require('request'), require("async"), require('xmldom').DOMParser, require("./views.js"));

function FarmConnector(request, async, DOMParser, views) {
  
    this.url = url;
    
    function url(baseS7AccountUrl, vignette, view, options, size, imageType, callback) {
       getXml(baseS7AccountUrl, vignette, function(err, xmlText){
           var url = farm(baseS7AccountUrl, vignette, options, view, size, imageType, xmlText);
           callback(null, url);
       });
    }
    
    function getXml(baseS7AccountUrl, vignette, callback) {
        var url = baseS7AccountUrl + "/" + vignette + "_" + views.defaultView() + "?req=contents";
        request(url, function (error, response, body) {
          callback(error, body);
        });
    }
    
    function getFarmTSkuString(options) {
        var optionKeys = Object.keys(options);
        var tSkuString = "";
        optionKeys.forEach(function(key){
           tSkuString += options[key] + "-"; 
        });
        return tSkuString;
    }
    
    function getFarmTMaterials(options) {
       var optionKeys = Object.keys(options);
        var tMaterials = [];
        optionKeys.forEach(function(key){
           tMaterials.push([key, options[key]]); 
        });
        return tMaterials;
    }

    //From here down, it's farm's code
    function farm(baseS7AccountUrl, vignette, options, angle, size, imageType, xml){
         //  For testing.......
        //scene7 renderserver URL
        var tUrl = baseS7AccountUrl + "/";
        //var tUrl = 'http://s7d4.scene7.com/ir/render/farmcprender/';
        
        //Published VNT name
        var tVnt = vignette;
        
        // dash delimenated product options (for finding VNT children)
        var tSku = getFarmTSkuString(options);
        
        // Include drop shadow
        var tDropShadowBool = true;
        
        //  view to render
        var tView = angle;
        
        //  x pixel res
        var tRes = size;
        
        //  output images type
        //var tImageType = "jpeg";
         var tImageType = imageType;
        
        var tMaterials = getFarmTMaterials(options);
        
        
        ///////////////////////////////////////////
        return getS7VignetteUrlFromXML(tUrl, tVnt, tSku, tMaterials, tView, tRes, tImageType, xml);
        
        //  Farm S7 XML Vignette Connnector Function
        // Function to filter, and return renderable URL
        function getS7VignetteUrlFromXML(iUrl, iVnt, iSku, iMaterials, iView, iRes, iImageType, tXml) {
            
        
            var iDropShadowBool = true;
            
            var parser = new DOMParser();
            var tXmlDoc = parser.parseFromString(tXml, "text/xml");
            
            // Namespace
            var farmS7 = {};
        
            //get the frame
            farmS7.tFrame = iView;
        
        
            //get the id of a node
            function getID(iNode) {
        
                var tIdValue;
                try {
                    tIdValue = iNode.attributes.getNamedItem("id").nodeValue;
                    return (tIdValue);
                } catch (err) {
                    return false;
                }
            }
        
            //Get Nodes from XML
            function getNodesFromS7xml(tNodes, tXml) {
        
                //recursive loop through two layers
                function s7GroupLoop(tChildNodes, iGroup, mNodeArray) {
        
                    var tGroup = "";
        
                    //loop through child nodes
                    for (var i1 = 0; i1 < tChildNodes.length; i1++) {
        
                        // set the default object boolean
                        var tDefaultObject = false;
        
                        // set the default object index
                        var tDefaultObjectIndex = 0;
        
                        // set the boolean for a match
                        var tMatchedNode = false;
        
                        //loop through the childs child nodes
                        for (var i2 = 0; tChildNodes[i1].childNodes && i2 < tChildNodes[i1].childNodes.length; i2++) {
        
                            //set the node
                            var tNodeUse = tChildNodes[i1].childNodes[i2];
        
                            //found default object
                            if (getID(tNodeUse) === "dflt") {
                                // set the default object boolean
                                tDefaultObject = true;
                                // set the default object index
                                tDefaultObjectIndex = i2;
                            }
        
                            //loop through the input nodes
                            for (var i3 = 0; i3 < tNodes.length; i3++) {
        
        
                                //check to see if they match
                                if (tNodes[i3] === getID(tNodeUse) && tNodeUse.nodeName === "group") {
        
                                    tMatchedNode = true;
        
                                    //append tgroup
                                    if (iGroup !== "") {
                                        tGroup = iGroup + "/" + getID(tChildNodes[i1]);
                                    } else {
                                        tGroup = getID(tChildNodes[i1]);
                                    }
        
                                    //add node to tgroup
                                    tGroup = tGroup + "/" + tNodes[i3];
        
                                    //Build sub array
                                    var tSubArray = [tNodeUse, tGroup]
        
                                    //add groupd to array
                                    mNodeArray.push(tSubArray);
        
                                    //recursive back through
                                    s7GroupLoop(tNodeUse.childNodes, tGroup, mNodeArray);
                                }
                            }
                        }
                        //run default if nothing was found and default object exists
                        if (tMatchedNode === false && tDefaultObject === true) {
                            //append tgroup
                            if (iGroup !== "") {
                                tGroup = iGroup + "/" + getID(tChildNodes[i1]);
                            } else {
                                tGroup = getID(tChildNodes[i1]);
                            }
        
                            var tNodeDefault = tChildNodes[i1].childNodes[tDefaultObjectIndex];
        
                            //add node to tgroup
                            tGroup = tGroup + "/" + "dflt";
        
                            //Build sub array
                            var tSubArray = [tNodeDefault, tGroup]
        
                            //add groupd to array
                            mNodeArray.push(tSubArray);
        
                            //recursive back through
                            s7GroupLoop(tNodeDefault.childNodes, tGroup, mNodeArray);
                        }
                    }
        
                }
        
                //node starting point
                var sChildNodes = tXml.getElementsByTagName('contents')[0].childNodes;
        
                var mNodeArray = [];
        
                //set the node array
                for (var j1 = 0; j1 < sChildNodes.length; j1++) {
        
                    if (getID(sChildNodes[j1]) === "root") {
                        mNodeArray = [[sChildNodes[j1], "root"]];
                    }
                }
        
                //Group string
                var sGroup = "";
        
                //start the recursive loop function
                s7GroupLoop(sChildNodes, sGroup, mNodeArray);
        
                // check for nodes in the root
                if (mNodeArray[0][1] === "root") {
                    s7GroupLoop(mNodeArray[0][0].childNodes, "root", mNodeArray)
                }
        
                //alert(mNodeArray);
        
                return mNodeArray;
            }
        
        
            function SetTheUrl(iUrl, iVnt, iDropShadow, iMaterials, iView, iRes, iImageType, iNodesArray, iAllNodesArray) {
        
                //Start the URL
                var tmainUrl = iUrl + iVnt + "_" + farmS7.tFrame + "?wid=" + iRes + "&fmt=" + iImageType + "&qlt=100&";
        
                //Build URL Strings var
                for (var i1 = 0; i1 < iNodesArray.length; i1++) {
                    for (var i2 = 0; i2 < iNodesArray[i1][0].childNodes.length; i2++) {
                        //get sub group
                        var tSubGroup = getID(iNodesArray[i1][0].childNodes[i2]);
                        //set the stat layer
                        if (tSubGroup === "stat") {
                            tmainUrl = tmainUrl + "obj=" + iNodesArray[i1][1] + "/stat&show&"
                        }
                        //set the drop
                        if (tSubGroup === "drop" && iDropShadow) {
                            tmainUrl = tmainUrl + "obj=" + iNodesArray[i1][1] + "/drop&show&"
                        }
                        for (var i3 = 0; iNodesArray[i1][0].childNodes[i2].childNodes && i3 < iNodesArray[i1][0].childNodes[i2].childNodes.length; i3++) {
                            var nodeToUse = iNodesArray[i1][0].childNodes[i2].childNodes[i3];
        
                            if (nodeToUse.nodeName !== "group") {
        
                                // go through iMaterials
                                for (var i4 = 0; i4 < iMaterials.length; i4++) {
        
                                    //found a layer
                                    if (getID(nodeToUse) === iMaterials[i4][0].toLowerCase()) {
                                        //set the layer
                                        tmainUrl = tmainUrl + "obj=" + iNodesArray[i1][1] + "/" + tSubGroup + "/" + getID(nodeToUse) + "&";
                                        if (iMaterials[i4][1] !== "" && iMaterials[i4][1] !== undefined && iMaterials[i4][1] !== null) {
                                            if (iMaterials[i4][1][0] !== "#") {
                                                //apply material 
                                                tmainUrl = tmainUrl + "src=" + iMaterials[i4][1] + "&";
                                            } else {
                                                //apply hex color
                                                tmainUrl = tmainUrl + "color=" + iMaterials[i4][1].replace("#", "") + "&";
                                            }
                                        }
                                        tmainUrl = tmainUrl + "show&";
                                    }
                                    //run color through for static overlap
                                    if (iMaterials[i4][1] !== "" && iMaterials[i4][1] !== undefined && iMaterials[i4][1] !== null) {
        
                                        if (getID(nodeToUse) === iMaterials[i4][1].toLowerCase()) {
                                            tmainUrl = tmainUrl + "obj=" + iNodesArray[i1][1] + "/" + tSubGroup + "/" + getID(nodeToUse) + "&show&";
                                        }
                                    }
                                }
        
                                //set static ovelap if in All nodes array
                                for (var i4 = 0; i4 < iAllNodesArray.length; i4++) {
                                    if (getID(nodeToUse) === iAllNodesArray[i4].toLowerCase()) {
                                        tmainUrl = tmainUrl + "obj=" + iNodesArray[i1][1] + "/" + tSubGroup + "/" + getID(nodeToUse) + "&show&";
                                    }
        
                                }
                            }
        
                        }
                    }
                }
        
                if (iImageType == "png-alpha") {
                    tmainUrl = tmainUrl + "obj=root&req=object";
                }
        
                return tmainUrl;
            }
        
            // set xml file
            //farmS7.xmlDoc = loadXmlFromS7V(farmS7.xmlUrl);
        
            // set nodes array
            farmS7.nodes = iSku.toLowerCase().split('-');
        
            farmS7.nodes.push("perp");
        
            // Get the used nodes path
            farmS7.nodesArray = getNodesFromS7xml(farmS7.nodes, tXmlDoc);
        
            //Get the main URL
            farmS7.mainUrl = SetTheUrl(iUrl, iVnt, iDropShadowBool, iMaterials, iView, iRes, iImageType, farmS7.nodesArray, farmS7.nodes);
        
            return farmS7.mainUrl;
        
        }
        
        //Function get URI for XML load
        function getXMLuriS7(iUrl, iVnt, iView) {
        
            var xmlUrl = iUrl + iVnt + "_" + iView + "?req=contents";
        
            var tYql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + xmlUrl + '"') + '&format=xml&callback=?';
        
            // Request that YSQL string, and run a callback function.
            // Pass a defined function to prevent cache-busting.
            return tYql;
        
        }
        
        
        ///////////////////////////////////
    }
    
}