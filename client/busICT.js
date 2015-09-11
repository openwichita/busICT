// Start centered on The Labor Party
var startingLocation = [37.6890338, -97.327983];

var map;
var routeLayers = {};


Template.body.helpers({
  getRoutes: Meteor.call("fetchNewRoutes", function(error, result)  {
            if(error) {
              console.log('freakin error', error);
              return;
            }
            console.log('IT WORKED.  ONLY IT PROBABLY WONT... HERE IS RESULT', result);
          })
});

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
    var layer = L.geoJson().addTo(map);
    routeLayers[route.id] = {layer: layer, data: route.geojson};
    layer.addData(route.geojson);
  });

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
