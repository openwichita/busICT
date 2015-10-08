/**
 *  Generates routes.js from "/Wichita_Transit_Routes.json"
**/

Meteor.methods({
/**
 *  Issues GET to Wichita GIS Bus Routes endpoint.
 **/
    'getNewRoutes': function() {
        this.unblock();
        return HTTP.get("http://opendata.arcgis.com/datasets/4b038a41d5fc4237b85b364b48d41445_0.geojson");
    }
});