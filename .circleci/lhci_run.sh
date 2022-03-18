#!/bin/bash +xe

# This script would lighthouse analysis for feat and fix commits and sends a slack notifcation if the current run lighthouse score is less than the pre-defined threshold


echo ""
echo "====== Lighthouse Run Started ================"
echo ""

gitmessage=$(git log --oneline -n 1 --format=%s)
read -r -d '' payload <<EOM
{
    "username": "LightHouse CI BOT",
    "channel": "${SLACK_DEFAULT_CHANNEL}",
    "attachments": [{
        "title": "LightHouse CI ALERT",
        "color": "#9C1A22",
        "pretext": "Build did not met lighthouse predefined metrics",
        "mrkdwn_in": ["text"],
        "text": "Build URL : ${CIRCLE_BUILD_URL}",
        "thumb_url": "https://raw.githubusercontent.com/GoogleChrome/lighthouse/8b3d7f052b2e64dd857e741d7395647f487697e7/assets/lighthouse-logo.png"
    }]
}
EOM
messagecheck=$(echo "${gitmessage}" | grep -E "^(feat.*|fix.*)")
set -e
if [[ ! -z "$messagecheck" ]]; then
    echo ""
    echo "---------------------------------------------"
    echo ""
    echo "Commit message Contains feat/fix , running lighthouse test"
    echo ""
    echo "---------Install lhci package--------------"
    echo ""
    sudo npm install -g @lhci/cli@0.7.x
    node -v
    google-chrome --version
    echo ""

    echo "---------Collect and upload lhci metrics--------------"
    echo ""
    echo "Collect the lighthouse Metrics"
    sudo env GITHUB_TOKEN=$GITHUB_TOKEN LHCI_GITHUB_APP_TOKEN=$LHCI_GITHUB_APP_TOKEN IS_DEV=true lhci autorun --upload.token=${LHCI_TOKEN}
    echo ""
    echo "===================[CHECKPOINT] Verify lighthouse ci results started [$(date +"%m-%d-%Y::%T")]  ==============================="
    echo ""
    set +e
    lhci_assert_result=$(cat .lighthouseci/assertion-results.json | grep "passed" | grep "false")

    if [[ -z ${lhci_assert_result} ]]; then
        echo "All pre-configured assertion have passed ..."
    else
        echo "pre-configured assertions metrics have not met , send slack notification"
        SLACK_SENT_RESPONSE=$(curl -s -f -X POST -H 'Content-type: application/json' -H "Authorization: Bearer $SLACK_ACCESS_TOKEN" --data "$payload" https://slack.com/api/chat.postMessage)
        echo "slack sent response : ${SLACK_SENT_RESPONSE}"
    fi

    echo ""
    echo "===================[CHECKPOINT] Verify lighthouse ci results completed [$(date +"%m-%d-%Y::%T")] ==============================="
    echo ""
else
    echo "---------------------------------------------"
    echo ""
    echo "Commit message did not contain feat/fix in the commit message ignoring lighthouse test"
    echo "${gitmessage}"
    echo ""
fi

echo ""
echo "====== Lighthouse Run Completed ================"
echo ""
