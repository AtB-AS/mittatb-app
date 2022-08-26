/**
 * @format
 */
import './override-deprecated-proptypes';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src';
import appInfo from './app.json';

AppRegistry.registerComponent(appInfo.name, () => App);
