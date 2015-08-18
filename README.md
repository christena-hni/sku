# sku
translator of sku number to scene7 product image urls

# Generating data

All data served by this API is based on files located at _.\data_ directory.

## Textiles and Fabrics data

Textiles and fabrics data are located at _.\data\materials_ directory. The data is stored in a CSV file (_textiles.csv_) and transformed into a JSON (_textiles.json_) by _indexData.js_ script.

In order to run it simply run ```node indexData.js```
