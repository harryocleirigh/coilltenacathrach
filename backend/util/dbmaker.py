import pandas as pd
import sqlite3

# List of your CSV files
csv_files = [
    'Dublin_1.csv',
    'Dublin_2.csv',
    'Dublin_3.csv',
    'Dublin_4.csv',
    'Dublin_5.csv',
    'Dublin_6.csv',
    'Dublin_6W.csv',
    'Dublin_7.csv',
    'Dublin_8.csv',
    'Dublin_9.csv',
    'Dublin_10.csv',
    'Dublin_11.csv',
    'Dublin_12.csv'
]

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('trees.db')

# Iterate through the CSV files, read each one, and create a table in the SQLite database
for file_name in csv_files:
    # Read CSV file into a DataFrame
    df = pd.read_csv(file_name)
    
    # Define table name based on file name, e.g., 'Dublin_1' for 'Dublin_1.csv'
    table_name = file_name.split('.')[0]
    
    # Write DataFrame to the SQLite database as a new table
    df.to_sql(table_name, conn, if_exists='replace')

# Close the connection
conn.close()
