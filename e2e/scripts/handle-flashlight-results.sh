#!/bin/bash

if [ "$#" -ne 2 ]
then
    echo "Argument error!"
    echo "First argument should be the measures to remove (int)"
    echo "Second argument should be the feature name (string)"
    echo "Example: ./handle-flashlight-results.sh 20000 map"
    echo "Example: ./handle-flashlight-results.sh 0 travelsearch"
    exit 1
else
    MS_TO_REMOVE=$1
    FEATURE=$2

    mv performance_measures_${FEATURE}_*.json performance_measures_${FEATURE}.json
    python performance/removeMeasures.py --max ${MS_TO_REMOVE} --feature ${FEATURE}
    cp performance_measures_${FEATURE}.json performance/performance_measures.json
    npx tsx performance/createPerformanceSummary.ts
    mv performance_measures_summary.json performance_measures_summary_${FEATURE}.json
fi
