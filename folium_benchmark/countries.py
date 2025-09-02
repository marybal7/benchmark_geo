import folium
import geojson
import re
from branca.element import Element, JavascriptLink
from html.parser import HTMLParser

with open("world_coordinates.geojson") as f:
    gj = geojson.load(f)

m = folium.Map()

for i in range(len(gj['features'])):
    data = gj['features'][i]['properties']
    name = data['name']
    first_coord = data['latitude']
    second_coord = data['longitude']
    folium.CircleMarker(
        location=[first_coord, second_coord],
        radius=5,
        color='white',
        weight=1,
        fill=False,
        fill_color="blue",
        fill_opacity=1,
        tooltip="Click me!",
        popup=name
    ).add_to(m)

m.save("index.html")

