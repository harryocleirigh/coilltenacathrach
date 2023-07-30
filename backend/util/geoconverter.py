import geopandas as gpd

# read the shapefile
gdf = gpd.read_file('data/Dublin_Trees_V001_2020_05_05_Ningal_Mills/ESRI_Shape/Dublin_Trees_V001_2020_05_05_Ningal_Mills.shp')

# convert the GeoDataFrame to GeoJSON
geojson = gdf.to_json()

# write the GeoJSON data to a file
with open('output.geojson', 'w') as f:
    f.write(geojson)
