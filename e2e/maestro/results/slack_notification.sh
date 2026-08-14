#!/bin/bash

if [ "$#" -ne 5 ]
then
    echo "Argument error!"
    echo "First argument should be the Slack token"
    echo "Second argument should be the Slack channel"
    echo "Third argument should be the GitHub run id"
    echo "Fourth argument should be type of test"
    echo "Fifth argument should be tested app version"
    exit 1
else
    SLACK_TOKEN=$1
    SLACK_CHANNEL=$2
    GH_RUN_ID=$3
    TEST_TYPE=$4
    TESTED_VERSION=$5
    GH_REF="https://github.com/AtB-AS/mittatb-app/actions/runs/${GH_RUN_ID}"

    # Parse failures from JUnit XML — one line per testcase name, indented failures beneath
    FAILURE_TEXT=$(python3 <<'PYEOF'
import xml.etree.ElementTree as ET
tree = ET.parse('results.xml')
lines = []
for tc in tree.getroot().iter('testcase'):
    failures = tc.findall('failure')
    if failures:
        lines.append(tc.get('name'))
        for f in failures:
            lines.append('\t- _' + (f.text or '') + '_')
print('\n'.join(lines))
PYEOF
)

    if [ -n "$FAILURE_TEXT" ]; then
        # WARNING: If error details are too long, Slack might give error 79 back. Might need to truncate or split in several messages
        PAYLOAD=$(jq -n \
            --arg channel "$SLACK_CHANNEL" \
            --arg header ":warning: *Errors in E2E App ${TEST_TYPE} tests - version ${TESTED_VERSION} (<${GH_REF}|GH action>)*" \
            --arg details "$FAILURE_TEXT" \
            '{
                channel: $channel,
                blocks: [
                    {type: "section", text: {type: "mrkdwn", text: $header}},
                    {type: "section", text: {type: "mrkdwn", text: $details}}
                ]
            }')

        curl -X POST https://slack.com/api/chat.postMessage \
            -H "Authorization: Bearer ${SLACK_TOKEN}" \
            -H "Content-type: application/json; charset=utf-8" \
            --data "${PAYLOAD}"
        echo ""
        echo "** Slack notification sent: errors **"
    else
        PAYLOAD=$(jq -n \
            --arg channel "$SLACK_CHANNEL" \
            --arg text ":white_check_mark: *All good for E2E App ${TEST_TYPE} tests - version ${TESTED_VERSION} (<${GH_REF}|GH action>)*" \
            '{
                channel: $channel,
                blocks: [
                    {type: "section", text: {type: "mrkdwn", text: $text}}
                ]
            }')

        curl -X POST https://slack.com/api/chat.postMessage \
            -H "Authorization: Bearer ${SLACK_TOKEN}" \
            -H "Content-type: application/json; charset=utf-8" \
            --data "${PAYLOAD}"
        echo ""
        echo "** Slack notification sent: success **"
    fi
fi
