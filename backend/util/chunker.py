import geopandas as gpd

# Load the GeoJSON file
geojson = gpd.read_file('data/reduced_file_size.geojson')

# Determine how many features per file
features_per_file = len(geojson) // 9

for i in range(9):
    start = i * features_per_file
    end = (i + 1) * features_per_file if i < 8 else None
    subset = geojson.iloc[start:end]
    subset.to_file(f'data/part{i + 1}.geojson', driver='GeoJSON')
