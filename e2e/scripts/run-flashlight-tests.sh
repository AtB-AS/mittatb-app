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

    echo "Run test for Travel Search"
    /home/runner/.flashlight/bin/flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=staging yarn test:android --spec test/flashlight/performanceMeasures_travelsearch.e2e.ts" --resultsTitle performance_measures_travelsearch --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    #flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=debug yarn test:android:local:firebase --spec test/flashlight/performanceMeasures_travelsearch.e2e.ts" --resultsTitle performance_measures_travelsearch --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    ./scripts/handle-flashlight-results.sh 30000 travelsearch

    echo "Run test for Departures"
    /home/runner/.flashlight/bin/flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=staging yarn test:android --spec test/flashlight/performanceMeasures_departures.e2e.ts" --resultsTitle performance_measures_departures --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    #flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=debug yarn test:android:local:firebase --spec test/flashlight/performanceMeasures_departures.e2e.ts" --resultsTitle performance_measures_departures --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    ./scripts/handle-flashlight-results.sh 30000 departures

    echo "Run test for Map"
    /home/runner/.flashlight/bin/flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=staging yarn test:android --spec test/flashlight/performanceMeasures_map.e2e.ts" --resultsTitle performance_measures_map --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    #flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=debug yarn test:android:local:firebase --spec test/flashlight/performanceMeasures_map.e2e.ts" --resultsTitle performance_measures_map --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    ./scripts/handle-flashlight-results.sh 30000 map

    echo "Run test for Tickets"
    /home/runner/.flashlight/bin/flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=staging yarn test:android --spec test/flashlight/performanceMeasures_tickets.e2e.ts" --resultsTitle performance_measures_tickets --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    #flashlight test --bundleId no.mittatb.staging --testCommand "APP_ENV=debug yarn test:android:local:firebase --spec test/flashlight/performanceMeasures_tickets.e2e.ts" --resultsTitle performance_measures_tickets --iterationCount ${TEST_ITERATIONS} --maxRetries ${MAX_RETRIES}
    ./scripts/handle-flashlight-results.sh 30000 tickets

fi
