import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements'

import Color from '../style/color';


const ListEmptyRefreshable = (props) => {
    let text = props.error ? '出错了 :(' : props.message;

    return (
        <View style={localStyle.container}>
            <Text style={localStyle.text}>{text}</Text>
            <Button fontSize={14} borderRadius={999} backgroundColor={Color.primary}
                  title={'刷新一下'}
                  onPress={() => props.onPress ? props.onPress() : null} />
        </View>
    );
}


const localStyle = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent: 'center',
        height: '100%'
    },
    text: {
        paddingBottom: 15,
        color: Color.text
    }
});


export {
    ListEmptyRefreshable
}