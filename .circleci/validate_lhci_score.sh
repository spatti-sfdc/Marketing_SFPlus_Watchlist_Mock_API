#!/bin/bash +xe

# This script would verify if the current commit lighthouse score has a 3% degradation than its pervious value for below metrics
# Performance
# Best Practices
# Accessibility
# SEO

echo ""
echo "====== Lighthouse Score Deviation Validation Started ================"
echo ""

gitmessage=$(git log --oneline -n 1 --format=%s)
messagecheck=$(echo "${gitmessage}" | grep -E "^(feat.*|fix.*)")
branch_name=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
# branch name field in lhci database has a 40 char limit , so we should do that same to query the branch result

branch_name_as_per_lhci=$(echo "${branch_name::40}")
current_hash_id=$(git log --format="%H" -n 1)

# slack payload

read -r -d '' payload <<EOM
{
    "username": "LightHouse CI BOT",
    "channel": "${SLACK_DEFAULT_CHANNEL}",
    "attachments": [{
        "title": "LightHouse CI ALERT",
        "color": "#9C1A22",
        "pretext": "Latest Build has more than 3% degradation in lighthouse score compared to previous commit, please check",
        "mrkdwn_in": ["text"],
        "text": "Build URL : ${CIRCLE_BUILD_URL}",
        "thumb_url": "https://raw.githubusercontent.com/GoogleChrome/lighthouse/8b3d7f052b2e64dd857e741d7395647f487697e7/assets/lighthouse-logo.png"
    }]
}
EOM

# below logic would get us the commit id that should have run lighthouse analysis earlier, so that we can use the same to compare against current commit

previous_hash_id=$(git log --format="%s|%H" | grep -E "^(feat.*|fix.*)" | head -2 | awk -F '|' '{ print $NF }' | tail -1)

# below function is used to compare floating numbers

function version_le() { test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" == "$1"; }

echo ""
echo "============================================================="
echo ""


if [[ ! -z "$messagecheck" ]]; then
    echo ""
    echo "Commit message Contains feat/fix , running lighthouse score validation check"
    echo ""


    echo "Current branch name                : ${branch_name}"
    echo "branch name for lhci               : ${branch_name_as_per_lhci}"
    echo "Current commit hash                : ${current_hash_id}"
    echo "Previous commit hash               : ${previous_hash_id}"

    echo ""

    # set variable PGPASSWORD for psql
    export PGPASSWORD=${psql_pwd}
    export project_name="${CIRCLE_PROJECT_REPONAME}"

    # validation of required variables empty or not

    if [[ -z "${current_hash_id}" ]] || [[ -z "${branch_name}" ]] || [[ -z "${previous_hash_id}" ]] || [[ -z "${psql_db}" ]] || [[ -z "${psql_user}" ]] || [[ -z "${psql_host}" ]] || [[ -z "${project_name}" ]]; then
        echo "current_hash_id/branch_name/previous_hash_id/psql_db/psql_user/psql_host/project_name are required paramters"
        echo "${current_hash_id}/${branch_name}/${previous_hash_id}/${psql_db}/${psql_user}/${psql_host}/${project_name} one or more paramters found empty"
        exit 0
    else
        echo "We have the required paramter values , proceeding  ..."
    fi

    echo ""
    echo "============================================================="
    echo ""

    echo "Install psql client"
    sudo apt-get update
    sudo apt-get install postgresql-client

    echo ""
    echo "============================================================="
    echo ""

    project_id=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select id from projects where name='${project_name}';")

    echo "project Id                         : ${project_id}"

    echo ""
    echo "============================================================="
    echo ""

    # Get the lhci build id from the lhci database , this id stores the information against commit hash

    current_build_id=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select id from builds where builds.\"projectId\"='${project_id}' AND branch='${branch_name_as_per_lhci}' AND hash='${current_hash_id}';")
    previous_build_id=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select id from builds where builds.\"projectId\"='${project_id}' AND branch='${branch_name_as_per_lhci}' AND hash='${previous_hash_id}';")

    if [[ -z "${current_build_id}" ]] || [[ -z "${previous_build_id}" ]]; then
        echo "current_build_id[${current_build_id}],previous_build_id[${previous_build_id}] were found empty in lhci database , ignore lighthouse score validation"
        exit 0
    fi

    echo "current  build id in lhci          : ${current_build_id}"
    echo "previous build id in lhci          : ${previous_build_id}"

    echo ""
    echo "============================================================="
    echo ""

    # we are now using the buildid which unique for the current commit hash , to get required lhci metrics

    current_performance_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${current_build_id}' AND name='category_performance_median';")
    current_accessibility_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${current_build_id}' AND name='category_accessibility_median';")
    current_best_practices_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${current_build_id}' AND name='category_best-practices_median';")
    current_seo_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${current_build_id}' AND name='category_seo_median';")

    if [[ -z "${current_performance_median}" ]] || [[ -z "${current_accessibility_median}" ]] || [[ -z "${current_best_practices_median}" ]] || [[ -z "${current_seo_median}" ]]; then
        echo "Did not get required data from lhci database, ignore lighthouse score validation"
        echo "current_performance_median[${current_performance_median}],current_accessibility_median[${current_accessibility_median}],current_best_practices_median[${current_best_practices_median}],current_seo_median[${current_seo_median}]"
        exit 0
    fi

    echo "current hash performance median    : ${current_performance_median}"
    echo "current hash accessibility median  : ${current_accessibility_median}"
    echo "current hash best_practice median  : ${current_best_practices_median}"
    echo "current hash seo median            : ${current_seo_median}"

    echo ""
    echo "============================================================="
    echo ""

    # we are now using the buildid which unique for the previous valid commit hash , to get required lhci metrics

    previous_performance_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${previous_build_id}' AND name='category_performance_median';")
    previous_accessibility_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${previous_build_id}' AND name='category_accessibility_median';")
    previous_best_practices_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${previous_build_id}' AND name='category_best-practices_median';")
    previous_seo_median=$(psql -d ${psql_db}  -U ${psql_user} -h ${psql_host} -tAc "select value from statistics where statistics.\"buildId\"='${previous_build_id}' AND name='category_seo_median';")

    if [[ -z "${previous_performance_median}" ]] || [[ -z "${previous_accessibility_median}" ]] || [[ -z "${previous_best_practices_median}" ]] || [[ -z "${previous_seo_median}" ]]; then
        echo "Did not get required data from lhci database, ignore lighthouse score validation"
        echo "previous_performance_median[${previous_performance_median}],previous_accessibility_median[${previous_accessibility_median}],previous_best_practices_median[${previous_best_practices_median}],previous_seo_median[${previous_seo_median}]"
        exit 0
    fi

    echo "previous hash performance median   : ${previous_performance_median}"
    echo "previous hash accessibility median : ${previous_accessibility_median}"
    echo "previous hash best_practice median : ${previous_best_practices_median}"
    echo "previous hash seo median           : ${previous_seo_median}"

    echo ""
    echo "============================================================="
    echo ""

    # using the previous commit has lhci metrics , we are calculating what could be the minimum devation that current lhci metrics scores can have

    min_req_performance=$(awk "BEGIN {print (${previous_performance_median} - (${previous_performance_median}*0.03))}")
    min_req_accessibility=$(awk "BEGIN {print (${previous_accessibility_median} - (${previous_accessibility_median}*0.03))}")
    min_req_best_practices=$(awk "BEGIN {print (${previous_best_practices_median} - (${previous_best_practices_median}*0.03))}")
    min_req_seo=$(awk "BEGIN {print (${previous_seo_median} - (${previous_seo_median}*0.03))}")

    echo "min required performance score     : ${min_req_performance}"
    echo "min required accessibility score   : ${min_req_accessibility}"
    echo "min required best_practice score   : ${min_req_best_practices}"
    echo "min required seo score             : ${min_req_seo}"

    echo ""
    echo "============================================================="
    echo ""

    # verify the current commit hash lhci metrics score are within the limits or not compared to previous commit hash

    if version_le ${current_performance_median} ${min_req_performance} || version_le ${current_accessibility_median} ${min_req_accessibility} || version_le ${current_best_practices_median} ${min_req_best_practices} || version_le ${current_seo_median} ${min_req_seo}; then
        echo "lighthouse score is decreased by 3% from previous value send slack alert"
        SLACK_SENT_RESPONSE=$(curl -s -f -X POST -H 'Content-type: application/json' -H "Authorization: Bearer $SLACK_ACCESS_TOKEN" --data "$payload" https://slack.com/api/chat.postMessage)
        echo "slack sent response : ${SLACK_SENT_RESPONSE}"
    else
        echo "lighthouse score deviation is within the limits no action needed"
    fi

else
    echo "---------------------------------------------"
    echo ""
    echo "Commit message did not contain feat/fix in the commit message ignoring lighthouse score validation check"
    echo "${gitmessage}"
    echo ""
fi


echo ""
echo "====== Lighthouse Score Deviation Validation Completed ================"
echo ""
