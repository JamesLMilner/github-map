import sys
import os
import json
from urllib2 import urlopen, Request, HTTPError
from urllib import quote

## You will need a API request token from GitHub:
## https://github.com/settings/tokens

if "GITHUB_MAP_TOKEN" in os.environ:
    TOKEN = os.environ['GITHUB_MAP_TOKEN']
else:
    ## Environment variables are better than hardcoding
    ## but if you want to you can put it here
    TOKEN = ""

def request(url, token):
    """ Send a HTTP request """
    try:
        req = Request(url)
        req.add_header('Authorization', 'token %s' % token)
        response = urlopen(req)
    except HTTPError as err:
        print "There was an HTTP error: " + str(err.code)
        print err.read()
        return
    return json.load(response)

def city_users(variation, country, token):
    """ Find the number of users in a city """

    github_url = "https://api.github.com/search/users?q=+location:"
    city_address = quote('"' + variation + ", " + country + '"')
    url = github_url + city_address
    print ""
    print "Getting...", variation + ", " + country
    print "URL: " + url

    total = int(request(url, token)["total_count"])

    return total

if __name__ == "__main__":
    if sys.argv[1]: 
        PLACE = sys.argv[1].split(",")
        CITY = PLACE[0]
        COUNTRY = PLACE[1]
        print city_users(CITY, COUNTRY, TOKEN)

    else:
        print "No city/country passed in"


