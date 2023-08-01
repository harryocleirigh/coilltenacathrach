import geopandas as gpd
from pyproj import CRS

# Load geojson file
df = gpd.read_file('neighbourhood.geojson')

# Specify the source coordinate system (Irish Transverse Mercator)
df.crs = CRS("EPSG:2157")

# Transform to WGS84
df = df.to_crs("EPSG:4326")

# Save to new GeoJSON file
df.to_file('revisedneighbourhood.geojson', driver='GeoJSON')
