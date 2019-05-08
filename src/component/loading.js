import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window')


export default class Loading extends Component {

    constructor(props) {
        super(props);
    }

    /*
    show() {
        this.setState({visible: true})
    }
    
    hide() {
        this.setState({visible: false})
    }
    */

    render() {
        if (this.props.visible) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#aaa" />
                </View>
            );

        } else {
            return <View />
        }
    }
}

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        left: 0,
        top: 0,
        width: width,
        height: 400,
        justifyContent: "center",
        alignItems: "center"
    }
});