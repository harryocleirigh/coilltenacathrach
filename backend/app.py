from flask import Flask, jsonify, request
from flask_cors import CORS
from dateutil.parser import parse
import json
import geopandas as gpd

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

# An array to hold all your preloaded data
preloaded_data = [None] * 9

# Loading the geojson files
for i in range(1, 10):
    preloaded_data[i - 1] = load_geojson(f'data/part{i}.geojson')

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
        return preloaded_data[part_number - 1], 200

if __name__ == '__main__':
    app.run()
