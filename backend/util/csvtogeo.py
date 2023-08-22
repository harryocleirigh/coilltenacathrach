import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# Load the CSV data into a pandas DataFrame
df = pd.read_csv('Dublin_12.csv')

# Create a "geometry" column with Point objects based on the latitude and longitude
df['geometry'] = df.apply(lambda row: Point(row.POINT_X, row.POINT_Y), axis=1)

# Convert the DataFrame to a GeoDataFrame
gdf = gpd.GeoDataFrame(df, geometry='geometry')

# Save the GeoDataFrame as a GeoJSON file
gdf.to_file('Dublin_12.geojson', driver='GeoJSON')
