# Read a property safely from config file, instead of sourcing the file
prop() {
  grep -e "^${1}=" ./.env | cut -d'=' -f2 | head -n 1;
}

react-native run-android --appId "$(prop 'ANDROID_APPLICATION_ID')"