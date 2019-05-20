import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Touchable from '../touchable';
import Color from '../../style/color'


export default class Notification extends Component {

    render() {
        return (
            <Touchable onPress={() => {}}>
                <View style={localStyle.container}>
                    <Ionicons name="ios-text" size={16}
                        style={localStyle.icon} color={Color.light} />
                    <Text style={localStyle.text}>{'XXX 回复了你|关注了你'}</Text>
                </View>
            </Touchable>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        padding: 20,
        borderColor: Color.line,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row'
    },
    icon: {
        marginRight: 10,
        marginTop: 1,
        lineHeight: 20
    },
    text: {
        flex: 1,
        lineHeight: 20
    }
});