import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Color from '../../style/color'


export default class DiaryActionIcon extends Component {

    _defaultOnPress() {
        
    }

    render() {
        return (
            <TouchableOpacity onPress={
                this.props.onPress ? this.props.onPress : this._defaultOnPress.bind(this)
            }>
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
