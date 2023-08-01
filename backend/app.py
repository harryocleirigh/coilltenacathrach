from flask import Flask, jsonify, request
from flask import Response
from flask_cors import CORS
from dateutil.parser import parse
import json
import geopandas as gpd
import pandas as pd

app = Flask(__name__)
CORS(app, supports_credentials=True)

def load_geojson(file_path):
    try:
        print(f'reading {file_path}')
        geojson = gpd.read_file(file_path)
        data = geojson.to_json()
        print(f'finished reading {file_path}')
        return data
    except Exception as e:
        print(f"An error occurred during startup: {e}")
        return None

def load_csv(file_path):
    try:
        print(f'reading {file_path}')
        data = pd.read_csv(file_path)
        gdf = gpd.GeoDataFrame(data, geometry=gpd.points_from_xy(data.POINT_X, data.POINT_Y))
        return gdf
    except Exception as e:
        print(f"An error occurred during startup: {e}")
        return None
    
def get_all_trees():
    with open('data/all_trees.json', 'r') as f:
        data = json.load(f)
    return data

# An array to hold all your preloaded data
preloaded_data = [None] * 9

# Loading the geojson files
for i in range(1, 10):
    preloaded_data[i - 1] = load_geojson(f'data/august_part{i}.geojson')

# now we want to allocate memory for our db effectively.
# by default the structure is an array but there are two many records for it to be quick
all_trees = get_all_trees()
# therefore we are going to convert the array into a 2d dictionary
all_trees = {tree['id']: tree for tree in all_trees}

if all(item is not None for item in preloaded_data):
    print()
    print('all chunked files loaded')
    print('lets go girls 😎')
    print()

# Define a single route that accepts a part number as a parameter
@app.route('/trees/<int:part_number>', methods=['GET'])
def getTreesPart(part_number):
    if preloaded_data[part_number - 1] is None:
        return jsonify({"error": f"Part{part_number} data could not be loaded"}), 500
    else:
        # for csv route
        # geojson = preloaded_data[part_number - 1].to_json()
        # return Response(response=geojson, mimetype="application/json")

        # otherwise lets just send the geojson chunk we made
        return preloaded_data[part_number - 1], 200

@app.route('/singletree/<int:id>', methods=['GET'])
def getSingleTree(id):
    if id in all_trees:
        # Flask's jsonify function can be used to convert json compatible data to a response object.
        return jsonify(all_trees[id]), 200
    else:
        return jsonify({"error": "Tree not found"}), 404

if __name__ == '__main__':
    app.run()
