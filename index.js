/**
 * @entry
 */

import {Alert, Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Icon, loadIcon} from './src/style/icon';

import App from './App';

import Token from './src/util/token';
import Api from './src/util/api';
import PageList from './src/page/_list';
import BottomNav from './src/nav/bottomNav';

import Push from './src/util/push';
import firebase from 'react-native-firebase';


// for debug
console.disableYellowBox = true;


Navigation.registerComponent('Timepill', () => App);
// regist screens automatically
for(let pageName in PageList) {
    Navigation.registerComponent(pageName, () => PageList[pageName]);
}

function loginByAccount() {
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
                            },
                            statusBar: {
                                backgroundColor: 'white',
                                style: 'dark'
                            }
                        }
                    }
                }]
            }
        }
    });
}

function loginByPassword() {
    Navigation.setRoot({
        root: {
            stack: {
                children: [{
                    component: {
                        name: 'Password',
                        options: {
                            topBar: {
                                title: {
                                    text: '请输入密码'
                                }
                            },
                            bottomTabs: {
                                visible: false,

                                // hide bottom tab for android
                                drawBehind: true,
                                animate: true
                            },
                            statusBar: {
                                backgroundColor: 'white',
                                style: 'dark'
                            }
                        },
                        passProps: {
                            type: 'login'
                        }
                    }
                }]
            }
        }
    });
}

Navigation.events().registerAppLaunchedListener(async () => {

    if(Platform.OS === 'ios') { //todo: android会弹出设备不支持 gppgle play 服务，暂时没解决
        firebase.crashlytics().enableCrashlyticsCollection();
    }

    Navigation.setDefaultOptions({
        layout: { orientation: ['portrait'] },
    })

    try {
        await loadIcon();
    } catch (err) {
        Alert.alert("loadIcon err: " + err.toString());
    }

    var splash;
    try {
        splash = await Api.syncSplash();
    } catch (err) {}


    let token = await Token.getUserToken();
    // let token;
    if(!token) {
        loginByAccount();

    } else {
        const password = await Token.getLoginPassword();
        if(password) {
            loginByPassword();
        } else {
            if(!splash) {
                try {
                    splash = await Api.getSplashByStore();
                } catch(e) {
                    console.error(e)
                }
            }
            Navigation.setRoot(BottomNav.config(splash));
        }
    }

    Push.init((msg) => {
        console.log("push init: " + msg);
    })


});

