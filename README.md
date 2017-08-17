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
Please feel free to contribute your city! In order to contribute, you will need to add your city and population to the to the github-cities.geojson file, located in the data folder. Please use a sourced city population (Wikipedia is fine!) and the total number of GitHub users.

It's probably easiest to check this manually for one off cities using the [Advanced Search functionality](https://github.com/search/advanced?q=sa&type=Repositories&utf8=%E2%9C%93).

# Acknowledgements
Thanks to [Esri](http://developers.arcgis.com) for the basemaps! This is based on an open source project I [did whilst at Esri UK](http://www.github.com/JamesMilnerUK/github-mapping).
Many thanks for the awesome Octocats from the Octodex https://octodex.github.com/ !
  
