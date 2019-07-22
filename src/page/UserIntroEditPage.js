import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Text,
    TextInput,
    DeviceEventEmitter,
    Keyboard
} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import {Icon} from '../style/icon';
import Msg from '../util/msg';
import Api from '../util/api';
import Token from '../util/token';
import Event from '../util/event';


export default class EditIntroPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            intro: props.user.intro
        }
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '修改简介'
              },
              rightButtons: [{
                  id: 'save',
                  icon: Icon.navButtonSave
              }]
            },
            bottomTabs: {
                visible: false,

                // hide bottom tab for android
                drawBehind: true,
                animate: true
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.refs.input.focus();
        }, 500);
    }

    navigationButtonPressed({buttonId}) {
        this.saveUserIntro();
    }

    saveUserIntro() {
        const len = this.state.intro.length;
        if(len === 0) {
            Alert.alert('提示', '简介不能为空');
            return;
        } else if (len > 500) {
            Alert.alert('提示', '简介不能超过500个字');
            return;
        }

        Api.updateUserInfo(this.props.user.name, this.state.intro)
            .then(async user => {
                Keyboard.dismiss();
                Msg.showMsg('修改成功');

                await Token.setUserInfo(user);
                DeviceEventEmitter.emit(Event.userInfoUpdated);
                
                Navigation.pop(this.props.componentId);
            })
            .catch(e => {
                Msg.showMsg('修改失败');
            })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
                <View style={localStyle.group}>
                    <TextInput ref='input'
                        underlineColorAndroid='transparent'
                        style={localStyle.textInput}
                        selectionColor={Color.primary}

                        value={this.state.intro}
                        onChangeText={(text) => this.setState({intro: text})}
                        multiline={true}
                    />
                </View>
            </View>
        );
    }
}


const localStyle = StyleSheet.create({
    group: {
        marginTop: 30,
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    textInput: {
        flexGrow: 1,
        fontSize: 16,
        margin: 15,
        color: Color.text,
        height: 200,
        textAlignVertical: 'top'
    }
});

