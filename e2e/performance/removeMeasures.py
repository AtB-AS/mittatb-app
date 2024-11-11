import json
import sys
import getopt


'''
# Removes measurements based on time according to the input params. Tightly connected to the performance measurements
from a flashlight test.

# Start
$ python3 removeMeasures.py 
    --min <remove measures from ms | default:0> [OPT]
    --max <remove measures up to ms | default:max> [OPT]
    --feature <extension to the file, i.e '_feature.json' | default:performance_measurements.json> [OPT] 
    
# Requirement
- performance_measurements<_feature>.json: results from a flashlight test

# Example
-> Remove all measurements for the first 15 sec in 'performance_measurements_map.json'
$ python3 removeMeasures.py --max 15000 --feature map

# Output
1. performance_measurements<_feature>.json: the same file without given range
'''


def main(argv):

    measurementFile = "performance_measures"
    hasMinMs = False
    hasMaxMs = False
    minMs = 0
    maxMs = 0

    # Input parameters
    try:
        opts, args = getopt.getopt(argv, "", ["min=", "max=", "feature="])
    except getopt.GetoptError:
        print('python3 removeMeasures.py '
              '--min <remove measures from ms | default:0> [OPT]'
              '--max <remove measures up to ms | default:max> [OPT]'
              '--feature <extension to the file, i.e "_feature.json" | default:performance_measurements.json> [OPT]')
        sys.exit()
    for opt, arg in opts:
        if opt == '--min':
            minMs = int(arg)
            hasMinMs = True
        elif opt == '--max':
            maxMs = int(arg)
            hasMaxMs = True
            if maxMs < minMs:
                print('Max ms is below min ms')
                sys.exit()
        elif opt == '--feature':
            feature = str(arg)
            measurementFile += '_{}'.format(feature)

    # Add extension
    measurementFile += '.json'

    # Read from file
    with open(measurementFile, 'r') as rd:
        testResults = json.load(rd)
        iterations = testResults['iterations']
        # Check measurements in each iteration
        for iteration in iterations:
            measures = iteration['measures']
            newMeasures = []
            # Check time for each measurement
            for measure in measures:
                if hasMinMs and hasMaxMs:
                    if not (minMs < int(measure['time']) < maxMs):
                        newMeasures.append(measure)
                elif hasMinMs:
                    if not int(measure['time']) > minMs:
                        newMeasures.append(measure)
                elif hasMaxMs:
                    if not int(measure['time']) < maxMs:
                        newMeasures.append(measure)
            iteration['measures'] = newMeasures
        with open(measurementFile, 'w+') as newJson:
            json.dump(testResults, newJson)


if __name__ == '__main__':
    main(sys.argv[1:])