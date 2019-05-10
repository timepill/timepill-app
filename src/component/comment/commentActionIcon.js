import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet-api';

import Color from '../../style/color'


export default class CommentActionIcon extends Component {

    _defaultOnPress() {
        
    }

    render() {
        return (
            <TouchableOpacity style={localStyle.moreIcon}
                onPress={this.props.onPress ? this.props.onPress : this._defaultOnPress.bind(this)}
            >
                <Icon name="ios-more"
                    size={24}
                    color={Color.inactiveText} />

            </TouchableOpacity>
        );
    }
}

const localStyle = StyleSheet.create({
    moreIcon: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        paddingHorizontal: 12,
        paddingVertical: 5
    }
});
