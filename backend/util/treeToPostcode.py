import geopandas as gpd
import pandas as pd
from shapely.geometry import Point

# Read CSV file with tree data
trees_df = pd.read_csv('reduced_trees.csv')

# Convert to GeoDataFrame, setting the geometry from x and y columns
trees_gdf = gpd.GeoDataFrame(
    trees_df, geometry=[Point(xy) for xy in zip(trees_df.POINT_X, trees_df.POINT_Y)])

# Read neighborhood GeoJSON file
neighborhoods_gdf = gpd.read_file('revisedneighbourhood.geojson')

# Perform spatial join to match trees with neighbourhoods
joined_gdf = gpd.sjoin(trees_gdf, neighborhoods_gdf, op='within')

# joined_gdf now contains the information from both the trees and the neighborhoods
joined_gdf.to_csv('reduced_trees_postcodes.csv')
