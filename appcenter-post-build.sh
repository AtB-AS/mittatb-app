echo "Running appcenter-post-build with: Jobstatus: $AGENT_JOBSTATUS, branch: $APPCENTER_BRANCH, Variant: $APPCENTER_ANDROID_VARIANT"

if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then
    if [ "$APPCENTER_BRANCH" == "master" ];
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
                -F apiKey=61fa3faa9328f37c95c019dde6c95ba5 \
                -F appVersion=1.0 \
                -F dev=false \
                -F platform=ios \
                -F sourceMap=@ios-release.bundle.map \
                -F bundle=@ios-release.bundle \
                -F projectRoot=`pwd`
        else 
            echo "Generating and uploading Android source maps"
            npx bugsnag-sourcemaps upload \
                --api-key=61fa3faa9328f37c95c019dde6c95ba5 \
                --app-version=1.0 \
                --minifiedFile=android/app/build/generated/assets/react/release/index.android.bundle \
                --source-map=android/app/build/generated/sourcemaps/react/release/index.android.bundle.map \
                --minified-url=index.android.bundle \
                --upload-sources \
                --overwrite
        fi
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi
fi