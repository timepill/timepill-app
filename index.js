/**
 * @entry
 */

import { Navigation } from 'react-native-navigation';

import App from './App';
import PageList from './src/page/_list'
import Token from './src/util/token'


async function init() {
    let token = await Token.getUserToken();
    if (!token) {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'App',
                title: 'App Title'
            }
        });

    } else {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'Home',
                title: 'Home Title'
            }
        });
    }
}


Navigation.registerComponent('App', () => App);
// regist screens automatically
for (let pageName in PageList) {
    Navigation.registerComponent(pageName, () => PageList[pageName]);
}

init();

