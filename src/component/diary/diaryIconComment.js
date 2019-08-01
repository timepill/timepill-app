import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Color from '../../style/color';


export default class DiaryIconComment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            count: props.count || 0
        }
    }

    render() {
        return (
            <View style={localStyle.wrap}>
                <Ionicons name="ios-text-outline" size={18}
                      style={localStyle.icon} />
                <Text style={localStyle.text}>
                    {this.state.count > 0 ? this.state.count : ''}
                </Text>
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        marginRight: 6,
        marginTop: -1
    },
    icon: {
        color: Color.inactiveText,
        marginLeft: 2,
        marginRight: 4
    },
    text: {
        fontSize: 15,
        color: Color.inactiveText
    }
});
