import React, { Component } from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';

import Api from '../util/api'


export default class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: props.color ? props.color : '#aaa'
        }
    }

    render() {
        if (this.props.visible) {
            return (
                <View style={localStyle.loading}>
                    <ActivityIndicator size="large" color={this.state.color} />
                </View>
            );

        } else {
            return <View />
        }
    }
}

const localStyle = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        width: Api.DEVICE_WINDOW.width,
        top: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
});