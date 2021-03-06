var fs = require('fs'); 
var http = require('http');
var geojson_url = 'http://portal.wichitagis.opendata.arcgis.com/datasets/1c9780e257fe4bb18df70bd4a30379ff_0.geojson';
var geojson_file = '../Wichita_Transit_Stops.json';
var stops_file = '../stops.js';
var geojson = ''; // global geojson data accessible from callbacks and functions

// Attempt to fetch the latest geojson data from wichta portal.
// Fallback to local JSON file if error occurs.
console.log("Fetching latest geojson data.");
http.get(geojson_url, function(res) {
  console.log("Got response: " + res.statusCode);
 
  // Fetch the json data in chunks and append to geojson variable.
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    geojson += chunk;
  });
  res.on('end', function() {
  	// If a JSON parse error occurs, handle the error by reading from existing local file.
  	try {
  		geojson = JSON.parse(geojson);
  		writeStopsFile();
  	}
  	catch (error) {
  		console.log("JSON Parse error: " + error.message);
  		readJSONFile();
  		writeStopsFile();
  	}
  })
// If there is a network error, handle it by reading from existing local file.
}).on('error', function(error) {
  console.log("Got error: " + error.message);
  readJSONFile();
  writeStopsFile();
});


// Fallback in case network or JSON parse error.
// Read geojson from local static file.
function readJSONFile() {
  console.log("Reading from existing local static file instead.");
  geojson = JSON.parse(fs.readFileSync(geojson_file, 'utf8'));
}

// Take the geojson object and filter for desired properties.
// Then write to the stops.js file.
function writeStopsFile() {
	var features = geojson.features;
	var stops = []; // bus stops
	var feature, props, geometry, stop;

	// Loop through the features array and put a subset of the properties data into bus stops
	for (var i=0; i<features.length; i++) {
		feature = features[i];
		props = feature.properties;
		geometry = feature.geometry;

		// Create the bus stop object based on the id, route name, location and coordinates
		stop = { 
			id: props.OBJECTID, 
			route: props.BUSROUTE, 
			location: props.LOCATION, 
			geojson: { type: geometry.type, coordinates: geometry.coordinates }
		}

		stops.push(stop);
	}

	// Create the text output to be written to file.
	// the bus_stops array needs to be turned into a string.
	var code_str = '// Generated by make_stops.js\n';
	code_str += '// Do not edit by hand.\n'
	code_str += "stops = " + JSON.stringify(stops);

	fs.writeFile(stops_file, code_str,  function(err) {
	   if (err) {
	       return console.error(err);
	   }
	   console.log("Bus Stops file written successfully!");
	}); 
}