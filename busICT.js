if (Meteor.isClient) {
  // Start centered on The Labor Party
  var startingLocation = [37.6890338, -97.327983];

  // When Template.map is rendered run this
  Template.map.rendered = function() {
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

    var map = L.map('map', {
      doubleClickZoom: false
    }).setView(startingLocation, 13);

    // Set the "Theme" for the map. Other nice options are:
    // Thunderforest.Transport
    // MapQuestOpen.OSM
    // OpenMapSurfer.Roads
    L.tileLayer.provider('OpenMapSurfer.Roads').addTo(map);

    // Set a window resize listener to set the map to the height of the
    // viewable area then force a resize for the initial load
    $(window).resize(function() {
      $('#map').css('height', window.innerHeight - 82 - 45);
    });
    $(window).resize(); // trigger resize event
  };
}
