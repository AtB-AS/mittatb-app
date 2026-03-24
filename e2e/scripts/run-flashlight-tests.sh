#!/bin/bash

if [ "$#" -ne 2 ]
then
    echo "Argument error!"
    echo "First argument should be the number of iterations (int)"
    echo "Second argument should be the number of max retries (int)"
    echo "Example: ./run-flashlight-tests.sh 2 1"
    exit 1
else
    TEST_ITERATIONS=$1
    MAX_RETRIES=$2

    echo "Run tests"
    /home/runner/.flashlight/bin/flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=staging yarn test:android --spec test/flashlight/performanceMeasures.e2e.ts" --resultsTitle performance_measures --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    #flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=debug yarn test:android:local:firebase --spec test/flashlight/performanceMeasures.e2e.ts" --resultsTitle performance_measures --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    cp performance_measures_*.json performance/performance_measures.json
    npx tsx performance/createPerformanceSummary.ts
    cp performance_measures_summary.json performance/performance_measures_summary.json
fi
