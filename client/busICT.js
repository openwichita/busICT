// Start centered on The Labor Party
var startingLocation = [37.6890338, -97.327983];

var map;
var routeLayers = {};

Template.body.helpers({
  routes: routes,
  stops: stops,
  lat: function() {
    return Session.get('lat');
  },
  lon: function() {
    return Session.get('lon');
  }
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
  // var lat = Session.get('lat');
  // var lon = Session.get('lon');
  //
  // var currentLocation = [lat, lon];

  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

  map = L.map('map', {
    doubleClickZoom: false
  }).setView(startingLocation, 15);

  // Session.set('map', map)
  // goToCurrentLocation();

  // L.marker(currentLocation).addTo(map);
  
  //
  // L.circle(currentLocation, 500, {
  //   color: 'red',
  //   fillColor: '#f03',
  //   fillOpacity: 0.5
  // }).addTo(map);


  // Set the "Theme" for the map. Other nice options are:
  // Thunderforest.Transport
  // MapQuestOpen.OSM
  // OpenMapSurfer.Roads
  L.tileLayer.provider('Thunderforest.Transport').addTo(map);

  routes.forEach(function(route) {
    var layer = L.geoJson().addTo(map);
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

    L.marker([lat, lon], { title: title_text  }).addTo(map);
  })

  //pan to current location after it's found
  navigator.geolocation.watchPosition(function(position) {

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    map.panTo([lat, lon]);

    var marker = L.marker([lat, lon]).addTo(map);
    // var circle = L.circle([lat, lon], 100, {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5
    // }).addTo(map);

    marker.bindPopup('<b>This is you!</b><br>All stops are marked on your map').openPopup();
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

