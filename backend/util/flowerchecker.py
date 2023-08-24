import pandas as pd

subset_df = pd.read_csv('Dublin_12.csv')
master_df = pd.read_csv('all_trees.csv')

# join on id
merged_df = pd.merge(subset_df, master_df[['id', 'Species_Co']], on='id', how='left')

# rename the 'species_co' column to 'species'
merged_df.rename(columns={'Species_Co': 'species'}, inplace=True)

subset_df = merged_df

subset_df.to_csv('Dublin_12.csv')