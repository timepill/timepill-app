import {NativeModules, Platform} from 'react-native';
import XGPushModule from 'react-native-smart-xgpush';
const XGPushNativeModules = NativeModules.XGPushModule;

function init(cb) {
    if(Platform.OS === 'android'){
        XGPushNativeModules.enableDebug(true);
        XGPushModule.notifyJSDidLoad(() => {
            XGPushModule.registerPush();
            initOtherPush();
            cb()
        });
    } else {
        cb();
    }
}

function initOtherPush() {
    XGPushNativeModules.enableOtherPush(true);

    const appId = '2882303761517764099';
    const appKey = '5341776464099';
    XGPushNativeModules.initXiaomi(appId, appKey);
}

function setAccount(uid, cb) {
    if(Platform.OS === 'ios'){
        XGPushModule.setAccount(uid,cb);
    }else{
        XGPushModule.bindAccount(uid,cb);
    }
}

function addReceiveNotificationListener(cb) {
    XGPushModule.addReceiveNotificationListener(cb);
}

function removeReceiveNotificationListener(cb) {
    XGPushModule.removeReceiveNotificationListener(cb)
}



export default {
    init,
    setAccount,
    addReceiveNotificationListener,
    removeReceiveNotificationListener,
}