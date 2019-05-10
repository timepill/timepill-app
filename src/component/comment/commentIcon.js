import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Color from '../../style/color'


export default class CommentIcon extends Component {

    render() {
        return (
            <View style={localStyle.commentIconBox}>
                <Icon name="ios-text-outline"
                      size={18}
                      color={Color.inactiveText}
                      style={localStyle.buttonIcon} />
                
                <Text style={localStyle.commentIconText}>{this.props.count}</Text>                
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    commentIconBox: {
        flexDirection: "row"
    },
    buttonIcon: {
        marginRight: 8,
        marginLeft: 2
    },
    commentIconIext: {
        fontSize: 15,
        color: Color.inactiveText
    }
});
