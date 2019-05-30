/**
 * @entry
 */

import {Alert} from 'react-native'
import {Navigation} from 'react-native-navigation';
import {Icon, loadIcon} from './src/style/icon';

import App from './App';

import Token from './src/util/token';
import PageList from './src/page/_list';
import BottomNav from './src/nav/bottomNav';


Navigation.registerComponent('Timepill', () => App);
// regist screens automatically
for(let pageName in PageList) {
    Navigation.registerComponent(pageName, () => PageList[pageName]);
}

Navigation.events().registerAppLaunchedListener(async () => {

    try {
        await loadIcon();
    } catch (err) {
        Alert.alert("loadIcon err: " + err.toString());
    }

    let token = await Token.getUserToken();
    // let token;
    if(!token) {
        Navigation.setRoot({
            root: {
                stack: {
                    children: [{
                        component: {
                            name: 'Timepill',
                            options: {
                                topBar: {
                                    visible: false,

                                    // hide top bar for android
                                    drawBehind: true,
                                    animate: true
                                }
                            }
                        }
                    }]
                }
            }
        });

    } else {
        Navigation.setRoot(BottomNav.config());
    }

});

