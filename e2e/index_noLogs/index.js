/**
 * @format
 */
import 'react-native-gesture-handler';
import './override-deprecated-proptypes';
import {AppRegistry, LogBox} from 'react-native';
import App from './src';
import appInfo from './app.json';

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appInfo.name, () => App);
