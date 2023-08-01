import pandas as pd

# Load the CSV file
data = pd.read_csv('august_trees.csv')

# Determine how many rows per file
rows_per_file = len(data) // 9

for i in range(9):
    start = i * rows_per_file
    end = (i + 1) * rows_per_file if i < 8 else None
    subset = data.iloc[start:end]
    subset.to_csv(f'august_part{i + 1}.csv', index=False)
