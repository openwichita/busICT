// Start centered on The Labor Party
var startingLocation = [37.6890338, -97.327983];
var currentLocation;

var map;
var routeLayers = {};

Template.body.helpers({
  routes: routes,
  stops: stops
})

Template.body.events({
  "click .route-link": function (event) {
    var id = event.originalEvent.target.dataset.id;
    var layer = routeLayers[id].layer;

    if (map.hasLayer(layer)) {
      $('#route-'+id+'-icon').addClass('glyphicon-unchecked').removeClass('glyphicon-check');
      map.removeLayer(routeLayers[id].layer);
    } else {
      $('#route-'+id+'-icon').addClass('glyphicon-check').removeClass('glyphicon-unchecked');
      map.addLayer(routeLayers[id].layer);
    }
  }
});

// When Template.map is rendered run this
Template.map.rendered = function() {
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

  map = L.map('map', {
    doubleClickZoom: false
  }).setView(startingLocation, 11);

  // Set the "Theme" for the map. Other nice options are:
  // Thunderforest.Transport
  // MapQuestOpen.OSM
  // OpenMapSurfer.Roads
  L.tileLayer.provider('Thunderforest.Transport').addTo(map);

  routes.forEach(function(route) {
    var layer = L.geoJson();
    routeLayers[route.id] = {layer: layer, data: route.geojson};
    layer.addData(route.geojson);
  })

  // Add bus stops to map
  var lat, lon, title_text, coordinates;
  stops.forEach(function(stop) {
    coordinates = stop.geojson.coordinates;
    lat = coordinates[1];
    lon = coordinates[0];
    title_text = stop.route + ": " + stop.location;

    var stopIcon = L.icon({
      iconUrl: '/stop-icon.png',
      iconRetinaUrl: '/stop-icon-2x.png',
      iconSize: [28, 101],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]
    });

    L.marker([lat, lon], { title: title_text, icon: stopIcon }).addTo(map);
  })

  // find current location then pan to location
  // Using geolocation api for browser location for now
  navigator.geolocation.watchPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    map.panTo([lat, lon]);
    map.setZoom(14); // hard to see current location without zoom

    if(!currentLocation){
      var options = {alt: 'Current Location Marker'}; // for accessibility
      currentLocation = L.marker([lat, lon], options).addTo(map);
    }

    currentLocation.setLatLng([lat, lon]).update();

    //show popup message to distinguish you from bus stop marker
    currentLocation
      .bindPopup('<b>This is you!</b><br>All stops are marked on your map')
      .openPopup();
  })

  // Set a window resize listener to set the map to the height of the
  // viewable area then force a resize for the initial load
  $(function() {
    $(window).resize(function() {
      $('#map').css('height', window.innerHeight - 51);
      map.invalidateSize();
    });
    $(window).resize(); // trigger resize event
  })
};
