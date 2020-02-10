if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then
    if [ "$APPCENTER_BRANCH" == "master" ];
     then
        if [ "$APPCENTER_ANDROID_VARIANT" == "release" ]; then
            bugsnag-sourcemaps upload \
                --api-key=61fa3faa9328f37c95c019dde6c95ba5 \
                --app-version=1.0 \
                --minifiedFile=android/app/build/generated/assets/react/release/index.android.bundle \
                --source-map=android/app/build/generated/sourcemaps/react/release/index.android.bundle.map \
                --minified-url=index.android.bundle \
                --upload-sources
        else 
            npx react-native bundle \
                --platform ios \
                --dev false \
                --entry-file index.js \
                --bundle-output ios-release.bundle \
                --sourcemap-output ios-release.bundle.map

            curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
                -F apiKey=61fa3faa9328f37c95c019dde6c95ba5 \
                -F appVersion=1.0 \
                -F dev=false \
                -F platform=ios \
                -F sourceMap=@ios-release.bundle.map \
                -F bundle=@ios-release.bundle \
                -F projectRoot=`pwd`
        fi
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi
fi