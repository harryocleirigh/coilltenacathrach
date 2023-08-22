import pandas as pd

# Load the CSV file
data = pd.read_csv('reduced_trees_postcodes.csv')

# Group the data by the 'postcodes' column
groups = data.groupby('postcodes')

# Loop through the groups and write each one to a separate CSV file
for name, group in groups:
    # Replace any non-alphanumeric characters with an underscore to ensure a valid filename
    safe_name = ''.join(ch if ch.isalnum() else '_' for ch in name)
    filename = f'august_{safe_name}.csv'
    group.to_csv(filename, index=False)
