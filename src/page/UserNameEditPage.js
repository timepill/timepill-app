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


export default class UserNameEditPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            name: props.user.name
        }
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '修改名字'
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
        this.saveUserName();
    }

    saveUserName() {
        const len = this.state.name.length;
        if (len === 0) {
            Alert.alert('提示', '名字不能为空');
            return;
        } else if (len > 10) {
            Alert.alert('提示', '名字不能超过10个字');
            return;
        }

        Api.updateUserInfo(this.state.name, this.props.user.intro)
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
                    <View style={localStyle.item}>
                        <Text style={localStyle.title}>名字</Text>
                        <TextInput ref='input'
                            style={localStyle.textInput}
                            underlineColorAndroid='transparent'
                            selectionColor={Color.primary}

                            value={this.state.name}
                            onChangeText={(text) => this.setState({name: text})}
                        />
                    </View>
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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 45
    },
    title: {
        fontSize: 16,
        color: '#222'
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 15,
        padding: 0,
        height: 24,
        color: Color.content
    }
});
