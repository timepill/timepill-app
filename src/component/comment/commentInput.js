import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import KeyboardSpacer from "react-native-keyboard-spacer";

import Touchable from '../touchable';
import Color from '../../style/color';
import Api from '../../util/api';


export default class CommentInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sending: false
        };
    }

    sendComment() {
        this.setState({sending: true});
    }

    render() {
        return (
            <View style={localStyle.container}>
                <TextInput style={localStyle.input}
                           selectionColor={Color.light}

                           ref="commentInput"

                           placeholder="回复日记"
                           value={this.state.comment_content}
                           
                           autoCorrect={false}
                           maxLength={500} multiline={true}
                           showsVerticalScrollIndicator={false}
                           underlineColorAndroid="transparent"
                           
                           onChangeText={() => {}}
                />
                <TouchableOpacity style={localStyle.buttonWrap}
                    onPress={this.sendComment.bind(this)}>

                    <View style={localStyle.button}>
                        <Icon name="md-arrow-round-up" size={22} color="#fff" />
                    </View>
                </TouchableOpacity>

                {this.state.sending
                ? (
                    <View style={localStyle.sending}>
                        <ActivityIndicator animating={true} color={Color.light} size="small"/>
                    </View>
                ) : null}

                {
                    !Api.IS_ANDROID
                    ? <KeyboardSpacer topSpacing={Api.IS_IPHONEX ? -30 : 0} />
                    : null
                }

            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        height: 56,
        backgroundColor: '#eee',
        elevation: 3,
        borderColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth
    },
    input: {
        flexGrow: 1,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 19,
        paddingRight: 40,
        paddingLeft: 15,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 12,
        lineHeight: 24,
        margin: 8
    },
    buttonWrap: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingBottom: 12,
        paddingRight:12,
        paddingTop: 12
    },
    button: {
        width: 32,
        height: 32,
        backgroundColor: Color.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16
    },
    sending: {
        flexGrow: 1,
        opacity: 0.8,
        backgroundColor: "#fff",
        top: 0,
        left: 0,
        bottom:0,
        right:0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    }
});