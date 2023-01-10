/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import HeadlessScraper from './HeadlessScraper';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('HeadlessScraper', () =>
    require('./HeadlessScraper'),
);
