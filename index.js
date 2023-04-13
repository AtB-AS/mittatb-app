/**
 * @format
 */
import 'react-native-gesture-handler';
import './override-deprecated-proptypes';
import {AppRegistry} from 'react-native';
import {App} from './src';
import appInfo from './app.json';

AppRegistry.registerComponent(appInfo.name, () => App);
