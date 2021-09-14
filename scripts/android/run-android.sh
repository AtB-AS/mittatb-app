export $(grep -v '^#' .env | gxargs -d '\n') > /dev/null 2>&1

react-native run-android --appId $ANDROID_APPLICATION_ID