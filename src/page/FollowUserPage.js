import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';


export default class FollowPage extends Component {

    constructor(props) {
        super(props);
    }

    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: '关注用户'
                }
            }
        };
    }

    render() {
        return (
            <View style={localStyle.container}>
              <Text style={localStyle.welcome}>Follow User Page !</Text>
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
