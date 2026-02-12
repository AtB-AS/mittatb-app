#!/bin/bash

if [ "$#" -ne 4 ]
then
    echo "Argument error!"
    echo "First argument should be the Slack token"
    echo "Second argument should be the Slack channel"
    echo "Third argument should be the GitHub run id"
    echo "Fourth argument should be type of test"
    exit 1
else
    SLACK_TOKEN=$1
    SLACK_CHANNEL=$2
    GH_RUN_ID=$3
    TEST_TYPE=$4
    GH_REF="https://github.com/AtB-AS/mittatb-app/actions/runs/${GH_RUN_ID}"

    # Create error file if any errors in the test
    ERRORS=$(jq -r '
    [
      .suites.suites[].tests[]
    ]
    | reduce .[] as $t (
        {seen: {}, list: []};
        if (.seen[$t.title] or $t.pass != false) then
          .
        else
          .seen[$t.title] = true
          | .list += [$t.title]
        end
      )
    | .list
    | join("\n")
    ' results-mochawesome.json)
    if [ -n "$ERRORS" ]; then
      echo "$ERRORS" > errors.log
    fi

    # Error or success
    if find e2e/results/ -maxdepth 1 -name "errors.log" | grep -q .; then
      # WARNING: If error details are too long, Slack might give error 79 back. Might need to truncate or split in several messages
      ERRORS=$(awk 'NR>1 {print ""} {printf "%s", $0}' e2e/results/errors.log)
      PAYLOAD_DETAILS=$(jq -n \
        --arg channel "$SLACK_CHANNEL" \
        --arg text "$ERRORS" '
      {
        channel: $channel,
        text: $text
      }')

      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":warning: *Errors in E2E App ${TEST_TYPE} tests (<${GH_REF}|GH action>)*\"}}]}"

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
      echo "** Slack notification sent: error details **"
    else
      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":white_check_mark: *All good for E2E App ${TEST_TYPE} tests (<${GH_REF}|GH action>)*\"}}]}"

      # Send slack notification
      curl -X POST https://slack.com/api/chat.postMessage \
        -H "Authorization: Bearer ${SLACK_TOKEN}" \
        -H "Content-type: application/json; charset=utf-8" \
        --data "${PAYLOAD}"
      echo ""
      echo "** Slack notification sent: success **"
    fi
       

fi
