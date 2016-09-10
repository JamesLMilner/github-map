__author__ = 'James'

import json
import urllib2
import csv
import base64
import time
import StringIO
from urllib2 import urlopen, Request, HTTPError
from urllib import quote


#https://github.com/settings/tokens
TOKEN = ""

def write_github_csv(cities_csv, output_csv):
    with open(cities_csv + '.csv', 'rb') as citiesCsv:
        citiesCsv = csv.reader(citiesCsv)
        with open(output_csv + '.csv', 'wb') as outputCsv:
            outputCsv = csv.writer(outputCsv)
            # Write headers

            headers = True
            for row in citiesCsv:

                if headers and row:

                    row.append("Total")
                    row.append("Rate")
                    outputCsv.writerow(row)
                    headers = False
                    continue

                # city, country, latitude, longitude, population
                city = row[0]
                country = row[1]
                population = int(row[4].replace(",", "").replace('"')) * 1000 # Remove any fluff

                try:
                    total = get_city_github_users(city, country, TOKEN)
                except HTTPError as err:
                    print "There was an HTTP error: " + str(err.code)
                    print err.read()
                    return

                row.append(total)
                rate = round(float(total) / float(population) * 100.0, 2)
                print total, population, rate
                print

                row.append(rate) # Rate
                outputCsv.writerow(row)

                time.sleep(3)

def request(url, token):
    request = Request(url)
    request.add_header('Authorization', 'token %s' % token)
    response = urlopen(request)
    return json.load(response)

def variations(variation, country, token):
    github_url = "https://api.github.com/search/users?q=+location:"
    cityAddress = quote('"' + variation + ", " + country + '"')
    url = github_url + cityAddress
    print "Getting...", variation + ", " + country
    print "URL: " + url

    total = int(request(url, token)["total_count"])
    time.sleep(1)
    url = github_url + quote('"' + variation + '"')
    print "URL: " + url
    print ""
    total += int(request(url, token)["total_count"])
    return total

def get_city_github_users(city, country, token):

    total = 0
    # Hacky as the cities sometimes have alternative names in brackets
    if "(" in city:
        cityVariations = city.split("(")
        for c in cityVariations:
            c = c.replace(")", "").strip()
            total += variations(c, country, token)

    else:
        total += variations(city, country, token)

    return total

if __name__ == "__main__":
    write_github_csv("cities", "github-cities")
