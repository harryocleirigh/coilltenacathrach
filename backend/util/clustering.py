import geopandas as gpd

# Load the GeoJSON data
gdf = gpd.read_file('cleaned_trees.geojson')

# Simplify the geometry
gdf['geometry'] = gdf['geometry'].simplify(tolerance=0.5)

# Save it back to GeoJSON
gdf.to_file('simplified_trees.geojson', driver='GeoJSON')
