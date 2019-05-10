/**
 * @entry
 */

import {Navigation} from 'react-native-navigation';
import {Icon, loadIcon} from './src/style/icon';

import App from './App';

import Token from './src/util/token';
import PageList from './src/page/_list';
import BottomNav from './src/nav/bottomNav';


async function init() {
    await loadIcon();

    let token = await Token.getUserToken();
    // let token;
    if (!token) {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'App'
            }
        });

    } else {
        Navigation.startTabBasedApp(BottomNav.config());
    }
}


Navigation.registerComponent('App', () => App);
// regist screens automatically
for (let pageName in PageList) {
    Navigation.registerComponent(pageName, () => PageList[pageName]);
}

init();

