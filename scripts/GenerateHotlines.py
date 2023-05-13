import csv
import json

def convertToJson(csvFilePath, jsonFilePath):
    data = {}

    csvFile = open(csvFilePath, encoding='utf-8')
    jsonFile = open(jsonFilePath, 'w', encoding='utf-8')

    csvReader = csv.DictReader(csvFile)

    jsonFile.write('[\n')

    for row in csvReader:
        json.dump(row, jsonFile, indent=4)
        if (row['COUNTRY_CODE'] == 'ZW'):
            jsonFile.write('\n')
        else:
            jsonFile.write(',\n')

    jsonFile.write(']')

csvFilePath = r'scripts\CrisisHotlines.csv'
jsonFilePath = r'src\assets\Hotlines.json'

convertToJson(csvFilePath, jsonFilePath);