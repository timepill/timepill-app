import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import Color from '../style/color'


export default class Photo extends Component {

    constructor(props) {
        super(props);

        if(props.uri) {
            this.formatUri = props.uri.replace('w240-h320', 'w320-h320-c320:320-q75');
        }
    }

    render() {
        return this.formatUri ? (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={localStyle.photoBox}>
                <Image style={localStyle.photo} source={{uri: this.formatUri}}/>
            </TouchableOpacity>

        ) : null;
    }
}

const localStyle = StyleSheet.create({
    photoBox: {
        width: 160,
        height: 160,
        marginTop: 15,
        backgroundColor: Color.spaceBackground,
        padding: 0,
        borderRadius: 5
    },
    photo: {
        flexGrow: 1,
        width: 160,
        height: 160,
        borderRadius: 5
    }
});
