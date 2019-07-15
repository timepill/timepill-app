import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Avatar} from "react-native-elements";


export default class UserIcon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iconUrl: props.iconUrl
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            iconUrl: nextProps.iconUrl
        };
    }

    _defaultOnPress() {
        // empty
    }

    render() {
        return (
            <Avatar rounded
                containerStyle={localStyle.container}
                width={this.props.width || 40}
                height={this.props.height || 40}
                source={{uri: this.state.iconUrl}}
                onPress={this.props.onPress ? this.props.onPress : this._defaultOnPress.bind(this)}
                activeOpacity={0.7}
            />
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        marginTop: 3,
        marginRight: 8,
    }
});
