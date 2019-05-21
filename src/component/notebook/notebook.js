import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, ImageBackground} from 'react-native';

import Api from '../../util/api';
import Color from '../../style/color'


export default class Notebook extends Component {

    getLabel(isPublic) {
        return isPublic ? null : (
            <Text style={localStyle.privateLabel}>私密</Text>
        );
    }

    render() {
        let notebook = this.props.notebook;
        
        return (
            <View style={Api.IS_ANDROID ? localStyle.androidBox : localStyle.iosBox}>
                <ImageBackground key={notebook.id}
                    style={localStyle.cover} imageStyle={{resizeMode: 'cover'}}
                    source={{uri: notebook.coverUrl}}>
                    
                    {this.getLabel(notebook.isPublic)}
                </ImageBackground>

                <View style={localStyle.banner}>
                    <View style={localStyle.subject}>
                        <Text allowFontScaling={false}>{notebook.subject}</Text>
                    </View>
                    <Text style={localStyle.desc} allowFontScaling={false}>
                        {notebook.isExpired ? '已过期' : '未过期'}
                    </Text>
                    <Text style={localStyle.desc} allowFontScaling={false}>
                        {notebook.created}至{notebook.expired}
                    </Text>
                </View>
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    androidBox: {
        width: 140,
        elevation: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        margin: 3,
        marginBottom: 15
    },
    iosBox: {
        width: 140,
        shadowColor: '#444',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        backgroundColor: '#fff',
        alignItems: 'center',
        margin: 3,
        marginBottom: 15
    },
    privateLabel: {
        position: 'absolute',
        top: 0,
        right: 7,
        fontSize: 11,
        padding: 3,
        backgroundColor: 'red',
        color: 'white',
        opacity: 0.75
    },
    cover: {
        width: 140,
        height: 105,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    banner: {
        alignItems:'center',
        width: 141,
        borderColor: '#eee',
        borderWidth: StyleSheet.hairlineWidth,
        borderTopWidth: 0,
        paddingBottom: 5
    },
    subject: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        height: 55,
        textAlign: 'center',
        fontWeight: 'bold',
        color: Color.text
    },
    desc: {
        fontSize: 10,
        color: Color.inactiveText
    }
});