echo "Running appcenter-post-build with: Jobstatus: $AGENT_JOBSTATUS, branch: $APPCENTER_BRANCH, Variant: $APPCENTER_ANDROID_VARIANT"

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | gxargs -d '\n')

# Include github tools
source github.sh

if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then
	if [ "$APPCENTER_BRANCH" == "master" || "$APPCENTER_BRANCH" == "alpha-release" ];
    then
        if [ -z "$APPCENTER_ANDROID_VARIANT" ]; then
            echo "Generating iOS source maps"
            npx react-native bundle \
                --platform ios \
                --dev false \
                --entry-file index.js \
                --bundle-output ios-release.bundle \
                --sourcemap-output ios-release.bundle.map

            echo "Uploading iOS source maps"
            curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
                -F apiKey=$BUGSNAG_API_KEY \
                -F appVersion=1.0 \
                -F appBundleVersion=$APPCENTER_BUILD_ID \
                -F dev=false \
                -F platform=ios \
                -F sourceMap=@ios-release.bundle.map \
                -F bundle=@ios-release.bundle \
                -F projectRoot=`pwd`
        else 
            echo "Generating and uploading Android source maps"
            npx bugsnag-sourcemaps upload \
                --api-key=$BUGSNAG_API_KEY \
                --app-version=$APPCENTER_BUILD_ID \
                --minifiedFile=android/app/build/generated/assets/react/$APP_ENVIRONMENT/index.android.bundle \
                --source-map=android/app/build/generated/sourcemaps/react/$APP_ENVIRONMENT/index.android.bundle.map \
                --minified-url=index.android.bundle \
                --upload-sources \
                --overwrite
        fi
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi
fi


if [ "$AGENT_JOBSTATUS" != "Succeeded" ]; then
    github_set_status_fail

    if [ "$APPCENTER_BRANCH" == "alpha-release" ]; then
        github_set_tag
    fi
else
    github_set_status_success
fi