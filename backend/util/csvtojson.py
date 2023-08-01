import pandas as pd

# Load the CSV data into a pandas DataFrame
df = pd.read_csv('all_trees.csv')

# Convert the DataFrame to a JSON string
json_data = df.to_json(orient='records')

# Write the JSON data to a file
with open('all_trees.json', 'w') as f:
    f.write(json_data)
