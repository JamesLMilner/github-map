(function() {

  var map;
  var ghLayer;
  var heat;
  var bands = 5;
  var maxRate = 0;
  var viewMode = "markers";
  var ghGeojsonUrl = "data/github-cities.geojson";

  var heatmapPoints = [];

  var icons = [
      [25, 23, "imgs/github.png"],
      [35, 33, "imgs/redpolo.png"],
      [45, 43, "imgs/americanfootball.png"],
      [55, 53, "imgs/jetpack.png"],
      [65, 63, "imgs/professor.png"]
  ];



  init();

  function init() {

    var center = [45.514, -2.122];
    var zoom = 5;
    map = L.map('map').setView(center, zoom);
    L.esri.basemapLayer("Gray").addTo(map);
    L.esri.basemapLayer("GrayLabels").addTo(map);

    initMarkers();
    initListners();

  }

  function initListners() {

    map.on('zoomend', setMarkerOpacity);
    document.getElementById("switch").addEventListener("click", toggleRenderer);

  }

  function initLegend() {

    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'legend');
        var legendTitle = '<strong class="legendtitle"> % of Pop. with GitHub</strong>';

        //Loop through our density intervals and generate a label with a colored square for each interval
        var lowerBounds = "0.000";
        var upperBounds;
        var lines = "";


        for (var i = 0; i < bands; i++) {
            upperBounds = ((maxRate / bands) * (i + 1)).toFixed(3);
            bounds = lowerBounds+' - '+upperBounds;
            lines = '<div class="legend-lines"><i class="iconstext">'+bounds+'</i>' +
                    '<img class="icons" src="'+icons[i][2]+'"' +
                    'width='+icons[i][0]+' height='+icons[i][1]+'></div>' + lines;
            lowerBounds = (parseFloat(upperBounds) + 0.001).toFixed(3);
        }

        div.innerHTML = legendTitle + div.innerHTML;
        div.innerHTML += lines;
        return div;
    };
    legend.addTo(map);

  }

  function initHeatmap() {

     heat = L.heatLayer(heatmapPoints, {
        minOpacity : 0.7,
        max : 0.9,
        radius : 18,
        blur : 23,
        gradient : {0.22: 'blue', 0.72: 'salmon', 1: 'dimgray'}
    });

  }

  function initMarkers() {

    var popupTemplate = "<h3>{City}</h3><p>" +
                        "<strong>Population</strong>: {Population}<br>" +
                        "<strong>GitHub accounts: </strong>{Total}<br>" +
                        "<strong>% with account \n" +
                        "</strong>: {Rate}</p><br>";

    L.Util.ajax(ghGeojsonUrl).then(function(data){

      ghLayer = new L.geoJson(data, {
          pointToLayer: function (geojson, latlng) {

              var rate = geojson.properties.Rate;
              var icon;
              if (rate > maxRate) maxRate = rate;
              icon = icons[1];

              if (rate >= 1.344) icon = icons[4];
              if (rate >= 1.008 && rate <= 1.343 ) icon = icons[3];
              if (rate >= 0.673 && rate <= 1.007 ) icon = icons[2];
              if (rate >= 0.337 && rate <= 0.672 ) icon = icons[1];
              if (rate >= 0.000 && rate <= 0.336 ) icon = icons[0];

              return L.marker(latlng, {
                  icon: L.icon({
                      iconUrl: icon[2],
                      iconSize: [icon[0], icon[1]],
                      iconAnchor: [icon[0] / 2, icon[1] / 2],
                      popupAnchor: [0, -11]
                  })
              })

              // Grow and shrink on mouse over, mouse out
              .on("mouseover",function(marker){
                var icon = marker.target._icon;
                icon.style.width = icon.clientWidth * 1.2 + "px";
                icon.style.height = icon.clientHeight * 1.2 + "px";
              })
              .on("mouseout",function(marker){
                var icon = marker.target._icon;
                icon.style.width = icon.clientWidth * 0.8 + "px";
                icon.style.height = icon.clientHeight * 0.8 + "px";
              });

          },

          onEachFeature : function(feature, layer) {
            var point = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
            point.push(feature.properties.Rate);
            heatmapPoints.push(point);

            feature.properties.Rate = parseFloat(feature.properties.Rate).toFixed(3);
            layer.bindPopup(L.Util.template(popupTemplate, feature.properties));
          }

      }).addTo(map);

      initHeatmap();
      initLegend();
      setMarkerOpacity();
      document.getElementById("loading").outerHTML = "";


    });

  }

  function toggleMarkers(opacity) {
    var markers = document.getElementsByClassName("leaflet-marker-icon");
    for(var i = 0; i < markers.length; i++){
      markers.item(i).style.opacity = opacity;
    }
  }

  function toggleRenderer(event) {

    event.stopPropagation();

    if (viewMode === "markers") {
      toggleMarkers(0);
      heat.addTo(map);
      document.getElementsByClassName("legend")[0].style.opacity = 0;
      document.getElementById("switch").innerHTML = "Markers";
      viewMode = "heatmap";
    } else {
      toggleMarkers(1);
      map.removeLayer(heat);
      viewMode = "markers";
      setMarkerOpacity();
      document.getElementsByClassName("legend")[0].style.opacity = 1;
      document.getElementById("switch").innerHTML = "Heatmap";
    }

  }

  function setMarkerOpacity() {

    var markerOpacities = {
      5 : 0.05,
      4 : 0.10,
      3 : 0.18,
      2 : 0.20,
      1 : 0.30
    };

    if (viewMode === "heatmap") return;
    var zoom = map.getZoom();
    var scaler = 2.1;
    var min = 0.22;

    for (var id in ghLayer._layers) {
      var marker = ghLayer._layers[id];
      var rate = parseFloat(marker.feature.properties.Rate); // Let's give every place some opacity at least
      var scaledOpacity = (((rate / maxRate) * scaler) - markerOpacities[zoom]) + min;
      var opacity = map.getZoom() < 6 ? scaledOpacity : 1;
      marker._icon.style.opacity = opacity;
    }

  }

})();
