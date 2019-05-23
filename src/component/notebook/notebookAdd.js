import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Color from '../../style/color'


export default class NotebookAdd extends Component {

    _defaultOnPress() {
        
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={
                this.props.onPress ? this.props.onPress : this._defaultOnPress.bind(this)
            }>
                <View style={localStyle.box}>
                    <Ionicons name="md-add" size={48} color={Color.inactiveText} />
                </View>
            </TouchableOpacity>
        );
    }
}

const localStyle = StyleSheet.create({
    box: {
        flex: 1,
        width: 140,
        shadowColor: '#444',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 1,
        backgroundColor: "#eee",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        marginBottom: 15
    }
});