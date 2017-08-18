# :octocat: GitHub Mapping :globe_with_meridians:
A map showing the estimated percentage of people in each city with a GitHub account.

# Cities and Population Data
The original populations and cities were derived from the 2015 estimates of this data set:

  * http://data.london.gov.uk/dataset/global-city-population-estimates
  * https://files.datapress.com/london/dataset/global-city-population-estimates/global-city-population-estimates.xls
  * UK Open Government Licence (OGL v2) - April 2014 - Copyright © 2014 by United Nations.

The results were massaged into a format for use with the Python GitHub scraper (github-api.py).

# Tech
The application uses:
  * [Leaflet](http://leafletjs.com/)
  * [Esri Leaflet](https://esri.github.io/esri-leaflet/)
  * [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)
  * [Leaflet.ajax](https://github.com/calvinmetcalf/leaflet-ajax)

# Contribution
Please feel free to contribute your city to the project. To add your city of choice, please edit the  github-cities.geojson file, with a sourced city population and the total number of GitHub users. For example, lets say we want to add Austin, Texas. We could add this to the geojson file:

```javascript
{
  "type": "Feature",
  "geometry": {
      "type": "Point",
      "coordinates":  [ -97.74,30.27 ]
  },
  "properties": {
  "City":"Austin",
  "Country":"United States of America",
  "Population": 2056405,
  "Total":"12318",
  "Rate":0.731472684
  }
},
```

It's probably easiest to check this manually for one off cities using the [Advanced Search functionality](https://github.com/search/advanced?q=sa&type=Repositories&utf8=%E2%9C%93), using the location search. Unfortunately, you may have to aggregate multiple search values, i.e. "Austin, Texas", "Austin, USA" to get a true representation of the values, as GitHub location field is a string of which you can input anything. We get the [population value from Wikipedia](https://en.wikipedia.org/wiki/Austin,_Texas).

You can also use the `github_api_one.py` script in the `scraping` folder. You will need a [GitHub API Token](https://github.com/settings/tokens) to make the requests. It is probably advisable to use an [environment variable](https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps) for the token, as `GITHUB_MAP_TOKEN`.

Please ensure the the GeoJSON is valid, for example using a tool like [GeoJSON Lint](http://geojsonlint.com/). 


# Acknowledgements
Thanks to [Esri](http://developers.arcgis.com) for the basemaps! This is based on an open source project I [did whilst at Esri UK](http://www.github.com/JamesMilnerUK/github-mapping).
Many thanks for the awesome Octocats from the Octodex https://octodex.github.com/ !
  
