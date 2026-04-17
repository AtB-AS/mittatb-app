#!/bin/bash

if [ "$#" -ne 4 ]
then
    echo "Argument error!"
    echo "First argument should be the Slack token"
    echo "Second argument should be the Slack channel"
    echo "Third argument should be the GitHub run id"
    echo "Fourth argument should be the tested app version"
    exit 1
else
    SLACK_TOKEN=$1
    SLACK_CHANNEL=$2
    GH_RUN_ID=$3
    TESTED_VERSION=$4
    GH_REF="https://github.com/AtB-AS/mittatb-app/actions/runs/${GH_RUN_ID}"

    # Get measures from test
    STATUS=$(jq -r '.status' performance_measures_summary.json)
    CPU_AVG=$(jq -r '.results.cpu.avg' performance_measures_summary.json)
    CPU_JS=$(jq -r '.results.cpu.threads.RN_JS' performance_measures_summary.json)
    CPU_NATIVE=$(jq -r '.results.cpu.threads.RN_Native' performance_measures_summary.json)
    CPU_RENDER=$(jq -r '.results.cpu.threads.Render' performance_measures_summary.json)
    CPU_UI=$(jq -r '.results.cpu.threads.UI' performance_measures_summary.json)
    FPS=$(jq -r '.results.fps' performance_measures_summary.json)
    RAM=$(jq -r '.results.ram' performance_measures_summary.json)
    SCORE=$(jq -r '.results.score' performance_measures_summary.json)

    PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":zap: *E2E App performance measures - version ${TESTED_VERSION} (<${GH_REF}|GH action>)*\"}}]}"

    if [ "$STATUS" = "SUCCESS" ]
    then
      PAYLOAD_DETAILS="{
        \"channel\": \"$SLACK_CHANNEL\",
        \"text\": \"- Score ($SCORE), FPS ($FPS), CPU ($CPU_AVG), RAM ($RAM)\n- CPU Threads: RN JS ($CPU_JS), RN Native ($CPU_NATIVE), Render ($CPU_RENDER), UI ($CPU_UI)\"
        }"
    else
      PAYLOAD_DETAILS="{
        \"channel\": \"$SLACK_CHANNEL\",
        \"text\": \":warning: *The tests failed*\n- Score ($SCORE), FPS ($FPS), CPU ($CPU_AVG), RAM ($RAM)\n- CPU Threads: RN JS ($CPU_JS), RN Native ($CPU_NATIVE), Render ($CPU_RENDER), UI ($CPU_UI)\"
        }"
    fi

    # Send slack notification
    curl -X POST https://slack.com/api/chat.postMessage \
      -H "Authorization: Bearer ${SLACK_TOKEN}" \
      -H "Content-type: application/json; charset=utf-8" \
      --data "${PAYLOAD}"
    echo ""
    echo "** Slack notification sent: errors **"
    curl -X POST https://slack.com/api/chat.postMessage \
      -H "Authorization: Bearer ${SLACK_TOKEN}" \
      -H "Content-type: application/json; charset=utf-8" \
      --data "${PAYLOAD_DETAILS}"
    echo ""
    echo "** Slack notification sent **"
fi
