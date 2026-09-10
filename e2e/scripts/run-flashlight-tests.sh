#!/bin/bash

if [ "$#" -ne 4 ]
then
    echo "Argument error!"
    echo "First argument should be the number of iterations (int)"
    echo "Second argument should be the number of max retries (int)"
    echo "Third argument should be the phone number for auth (int)"
    echo "Fourth argument should be the one time password for auth (int)"
    echo "Example: ./run-flashlight-tests.sh 2 1"
    exit 1
else
    TEST_ITERATIONS=$1
    MAX_RETRIES=$2
    PHONE_NUMBER=$3
    OTP=$4

    echo "Run tests"
    cd maestro
    /home/runner/.flashlight/bin/flashlight test --bundleId no.mittatb.staging --testCommand "maestro test -e APP_ID=no.mittatb.staging -e PHONE_NUMBER=${PHONE_NUMBER} -e OTP=${OTP} --test-output-dir results tests/performance.yaml" --resultsTitle performance_measures --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    #flashlight test --bundleId no.mittatb.staging --testCommand "maestro test -e APP_ID=no.mittatb.staging -e PHONE_NUMBER=${PHONE_NUMBER} -e OTP=${OTP} --test-output-dir results tests/performance.yaml" --resultsTitle performance_measures --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    cd ..
    cp maestro/performance_measures_*.json performance/performance_measures.json
    npx tsx performance/createPerformanceSummary.ts
    cp performance_measures_summary.json performance/performance_measures_summary.json
fi
