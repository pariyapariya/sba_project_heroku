// Creating map object
var myMap = L.map("map", {
  center: [37.0902, -95.7777],
  zoom: 4
});

// // Adding tile layer
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -10,
//   id: "mapbox/light-v9",
//   accessToken: API_KEY,
// }).addTo(myMap);

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);


// Grab data with d3



d3.json('/api/sba_by_state_approvals').then(function(data) {
// Grab data with d3
// d3.json('/api/sba_by_state_approvals', function(data) {

  console.log(data);

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "gross_approval",

    // Set color scale
    scale: ["#DE6E4B", "#3D5A80"],

    // Number of breaks in step range
    steps: 8,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#F0EBD8",
      weight: 1.15,
      fillOpacity: 1
    },

    // Binding a pop-up to each layer

    onEachFeature: function(feature, layer) {
      layer.bindPopup("" + feature.properties.name + "<br><hr>" +
        "$ " + feature.properties.gross_approval);
    }


  }).addTo(myMap);


  // ---------------------------------------------
  /*
  var a = function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  var b = function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  var geojson;
  // ... our listeners
  geojson = L.geoJson("click");

  var c = function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: a,
      mouseout: b,
      click: c
    });
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
*/
  // --------------------------------------------------

  // Set up the legend
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h2>Gross Approval</h2>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + "$ " + limits[0] + "</div>" +
        "<div class=\"max\">" + "$ " + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});
