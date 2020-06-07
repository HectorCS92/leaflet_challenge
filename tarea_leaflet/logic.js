// URL for data

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// request URL
d3.json(queryUrl, function(data) {

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function styleFunc(feature) {
        return {
          opacity: 1,
          fillOpacity: .5,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
		  radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }

      function getColor(d) {

        return d > 6  ? 'darkred' :
               d > 5  ? 'crimson' :
               d > 4  ? 'orange' :
               d > 3   ? 'coral' :
               d > 2   ? 'gold' :
               d > 1 ? 'greenyellow': 'lightgreen';
	  }
      function getRadius(d) {return d * 5}

  // create popup and define
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },

    style: styleFunc,
  });

  createMap(earthquakes);
};

//extraction URL for maps
function createMap(earthquakes) {

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiaGVjdG9yY3M5MiIsImEiOiJjazkwazR1d3EwMm01M2ZwZDdhdmJ5bWFtIn0.n9N4zyE74MyerFBQAq7tVA");

var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiaGVjdG9yY3M5MiIsImEiOiJjazkwazR1d3EwMm01M2ZwZDdhdmJ5bWFtIn0.n9N4zyE74MyerFBQAq7tVA");

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiaGVjdG9yY3M5MiIsImEiOiJjazkwazR1d3EwMm01M2ZwZDdhdmJ5bWFtIn0.n9N4zyE74MyerFBQAq7tVA");



  var baseMaps = {

    "Satellite Map": satelliteMap,
    "Outdoor Map": outdoorMap,
    "Light Map": lightMap

  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      38.510472, -102.974396
    ],
    zoom: 3,
    layers: [satelliteMap, earthquakes]
  });



  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend'),
	labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'],
    colors = ['#89da59', '#80bd9e', '#f98866', '#ff420e', '#bd0026', '#7a0177'];
    div.innerHTML = '<strong>Magnitude</strong>';
  };
  legend.addTo(myMap);

  L.control.layers(outdoorMap, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}