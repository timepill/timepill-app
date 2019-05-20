import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet-api';

import Color from '../../style/color'


export default class DiaryActionIcon extends Component {

    _defaultOnPress() {
        ActionSheet.showActionSheetWithOptions({
            options:['修改','删除', '取消'],
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1

        }, (index) => {
            if(index === 0) {
                

            } else if (index === 1) {
                Alert.alert('提示', '确认删除日记?',[
                    {text: '删除', style: 'destructive', onPress: () => {}},
                    {text: '取消', onPress: () => {}},
                ]);
            }
        });
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress ? this.props.onPress : this._defaultOnPress.bind(this)}>
                <Ionicons name="ios-more"
                      size={24}
                      color={Color.inactiveText}
                      style={localStyle.moreIcon} />

            </TouchableOpacity>
        );
    }
}

const localStyle = StyleSheet.create({
    moreIcon: {
        paddingVertical: 5,
        paddingHorizontal: 5
    }
});
