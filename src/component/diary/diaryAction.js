import React, {Component} from 'react';
import {DeviceEventEmitter, Alert} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Api from '../../util/api';
import Msg from '../../util/msg';
import Event from '../../util/event';


function action(componentId, diary, callbacks) {
    ActionSheet.showActionSheetWithOptions({
        options:['修改','删除', '取消'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1

    }, (index) => {
        if(index === 0) {
            Navigation.push(componentId, {
                component: {
                    name: 'Write',
                    options: {
                        bottomTabs: {
                            visible: false,

                            // hide bottom tab for android
                            drawBehind: true,
                            animate: true
                        }
                    },
                    passProps: {
                        diary: diary
                    }
                }
            });

        } else if (index === 1) {
            Alert.alert('提示', '确认删除日记?', [
                {text: '删除', style: 'destructive', onPress: () => {
                    Api.deleteDiary(diary.id)
                        .then(() => {
                            DeviceEventEmitter.emit(Event.updateDiarys, 'del');

                            Msg.showMsg('日记已删除');
                            if(callbacks && callbacks.onDelete){
                                callbacks.onDelete();
                            }
                        })
                        .catch(e => {
                            Msg.showMsg('日记删除失败' + e.message);
                        })
                }},
                {text: '取消', onPress: () => {}},
            ]);
        }
    });
}

export default {
    action
}