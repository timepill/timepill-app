import React, {Component} from 'react';
import {
    Alert,
    Linking
} from 'react-native';

import Api from './api';
import Msg from './msg';


async function updateAndroid() {
    try {
        let info = await Api.getUpdateInfo();
        // console.log('update info:', info, Api.VERSION);
        if(info.lastestVersion > Api.VERSION) {
            Alert.alert(
                '发现新版本 v' + info.lastestVersion,
                info.message,
                [
                    {text: '以后再说', onPress: () => {}},
                    {text: '更新', onPress: () => downloadApk(info.apkUrl, info.lastestVersion)},
                ],
                {cancelable: false}
            )
        }
    } catch(e) {}
}

async function downloadApk(url, version) {
    Linking.openURL(url);
    Msg.showMsg('从浏览器下载更新包');
}

export default {
    updateAndroid,
    downloadApk
}