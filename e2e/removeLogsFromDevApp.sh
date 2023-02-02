#!/bin/bash

# copy the index.js wich removes the logs
echo "Copy index.js from e2e/index_noLogs"
# cp e2e/index_noLogs/index.js index.js
echo "import {LogBox} from 'react-native';" >> index.js
echo "LogBox.ignoreAllLogs(true);" >> index.js