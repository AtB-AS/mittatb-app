# Report build status next to github commit.
# 
# - Fill in USER and APP with your user and appname in appcenter
# - Also provide GITHUB_TOKEN env variable in build config
#   (create token in GitHub Settings / Developer Settings / Personal access tokens, with 'repo:status' scope)
#
# Originally written by: Mirosław Zawisza
# https://zeyomir.github.io
# 
# The MIT License (MIT)
# Copyright (c) Microsoft Corporation

USER=AtB-AS

build_url=https://appcenter.ms/users/$USER/apps/$APP_NAME/build/branches/$APPCENTER_BRANCH/builds/$APPCENTER_BUILD_ID

github_set_status() {
    local status job_status
    local "${@}"

    curl -X POST https://api.github.com/repos/$USER/$BUILD_REPOSITORY_NAME/statuses/$BUILD_SOURCEVERSION -d \
        "{
            \"state\": \"$status\", 
            \"target_url\": \"$build_url\",
            \"description\": \"[BuildID: $APPCENTER_BUILD_ID] The build status is: $job_status!\",
            \"context\": \"continuous-integration/appcenter\"
        }" \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3.raw+json"
}

github_set_status_pending() {
    github_set_status status="pending" job_status="In progress"
}

github_set_status_success() {
    github_set_status status="success" job_status="$AGENT_JOBSTATUS"
}

github_set_status_fail() {
    github_set_status status="failure" job_status="$AGENT_JOBSTATUS"
}

github_set_tag() {

  if [ -z "$APPCENTER_ANDROID_VARIANT" ]; then
    tag_name="ios-$APPCENTER_BUILD_ID"
  else
    tag_name="android-$APPCENTER_BUILD_ID"
  fi

  message=$(git show -s --format=%B $BUILD_SOURCEVERSION | cat)

  curl -X POST https://api.github.com/repos/$USER/$BUILD_REPOSITORY_NAME/git/tags -d \
        "{
            \"tag\": \"$tag_name\",
            \"message\": \"### Release: [$tag_name]($build_url)\n\n$message\n\",
            \"object\": \"$BUILD_SOURCEVERSION\",
            \"type\": \"commit\",
            \"tagger\": {
              \"name\": \"atb-bot\",
              \"email\": \"utviklere@mittatb.no\",
              \"date\": \"$(date --utc +%FT%TZ)\",
            }
        }" \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3.raw+json"
}