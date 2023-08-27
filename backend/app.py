from flask import Flask, jsonify, request
from flask import Response
from flask_cors import CORS
from dateutil.parser import parse
import json
import geopandas as gpd
import pandas as pd
import sqlite3

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

# now we want to allocate memory for our db effectively. by default the structure is an array but there are too many records for it to be quick
all_trees = get_all_trees()

# therefore we are going to convert the array into a 2d dictionary
all_trees = {tree['id']: tree for tree in all_trees}

# Define a single route that accepts a part number as a parameter
@app.route('/trees/<int:part_number>', methods=['GET'])
def getTreesPart(part_number):
    conn = sqlite3.connect('trees.db')
    c = conn.cursor()

    if part_number == 13:
        c.execute('SELECT id, POINT_X, POINT_Y, species FROM Dublin_6W')
    else:
        c.execute(f'SELECT id, POINT_X, POINT_Y, species FROM Dublin_{part_number}')
    
    data = c.fetchall()
    columns = [desc[0] for desc in c.description]
    conn.close()

    df = pd.DataFrame(data, columns=columns)
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.POINT_X, df.POINT_Y))
    geojson = gdf.to_json()

    return Response(geojson, mimetype='application/json')

@app.route('/singletree/<int:id>', methods=['GET'])
def getSingleTree(id):
    if id in all_trees:
        # if id in all_trees and all_trees[id]['Species_Co'] != None:
        # Flask's jsonify function can be used to convert json compatible data to a response object.
        return jsonify(all_trees[id]), 200
    else:
        return jsonify({"error": "Tree not found"}), 404

if __name__ == '__main__':
    app.run()
