import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    DeviceEventEmitter,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import Api from '../util/api'
import Token from '../util/token';
import Event from '../util/event';
import Msg from '../util/msg';

import BottomNav from '../nav/bottomNav';
import PasswordInput from "../component/passwordInput";


export default class PasswordPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            oldPassword: null,
            step: 1,

            password: null
        };
    }

    static options(passProps) {
        return {
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    componentDidMount() {
        Token.getLoginPassword()
            .then(pwd => {
                if(this.props.type == 'setting') {
                    if(this.props.operation == 'setnew') {
                        this.setState({
                            title: '请输入新密码'
                        });

                    } else if(this.props.operation == 'cancel'){
                        this.setState({
                            title: '请输入密码',
                            oldPassword: pwd
                        });
                    }

                } else if(this.props.type == 'login') {
                    this.setState({
                        oldPassword: pwd
                    });
                }
            });
    }

    _onEnd(password) {
        if(this.props.type == 'setting') {
            if(this.props.operation == 'setnew') {
                this._setting(password);

            } else if(this.props.operation == 'cancel') {
                this._clearPassword(password);
            }

        } else if(this.props.type == 'login') {
            this._login(password);
        }
    }

    _setting(password) {
        if (this.state.step == 1) {
            if(!password.match(/^\d+$/)) {
                Alert.alert('提示', '只能设置数字密码');

            } else {

                this.setState({
                    title: '请再次输入密码',
                    password: password,
                    step: 2
                });
            }

            this.refs.input.clear();

        } else if (this.state.step == 2) {
            if(this.state.password !== password) {
                Alert.alert('设置失败', '两次输入的密码不相同,请重新输入');
                this.refs.input.clear();

                this.setState({
                    title: '请输入新密码',
                    password: null,
                    step: 1
                });

            } else {
                Token.setLoginPassword(password)
                    .then(() => {
                        Keyboard.dismiss();
                        Msg.showMsg('密码已设置');

                        DeviceEventEmitter.emit(Event.passwordUpdated);
                        Navigation.pop(this.props.componentId);
                    })
                    .catch(e => {
                        Alert.alert('错误', '设置密码失败:' + e.message);
                    })
            }
        }
    }

    _login(password) {
        if(!this.state.oldPassword) {
            Alert.alert('错误', '密码加载失败');
            return;
        }

        if(this.state.oldPassword === password) {
            Navigation.setRoot(BottomNav.config());

        } else {
            Alert.alert('失败', '密码错误');
        }

        this.refs.input.clear();
    }

    _clearPassword(password) {
        if(!this.state.oldPassword) {
            Alert.alert('错误', '密码加载失败');
            return;
        }

        if(this.state.oldPassword !== password) {
            Alert.alert('提示', '密码不正确');
            this.refs.input.clear();
            return;
        }

        Token.setLoginPassword('')
            .then(() => {
                Keyboard.dismiss();
                Msg.showMsg('密码已清除');

                DeviceEventEmitter.emit(Event.passwordUpdated);
                Navigation.pop(this.props.componentId);

            }).catch(() => {
                Alert.alert('错误', '清除密码失败');
            })
    }

    toLogin() {
        Navigation.setRoot({
            root: {
                stack: {
                    children: [{
                        component: {
                            name: 'Timepill',
                            options: {
                                topBar: {
                                    visible: false,

                                    // hide top bar for android
                                    drawBehind: true,
                                    animate: true
                                }
                            }
                        }
                    }]
                }
            }
        });
    };

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
                <View style={{flex: 1, alignItems: 'center', marginTop: 60}}>
                    <Text style={{fontSize: 24}}>{this.state.title}</Text>
                    <PasswordInput ref='input' style={{marginTop: 50}} maxLength={4} onEnd={this._onEnd.bind(this)}/>
                    {
                        this.props.type == 'setting' && this.props.operation != 'cancel'
                        ? (
                            <Text style={{marginTop: 50, fontSize: 11, color: Color.inactiveText}}>提示: 从后台切切换前台时不需要输入密码</Text>
                        ) : null
                    }
                    {
                        this.props.type == 'setting' ? null : (
                            <View style={{flex: 1, alignItems: 'center', paddingTop: 22}}>
                                <TouchableOpacity onPress={this.toLogin}>
                                    <Text style={{fontSize: 14, color: Color.primary, padding: 10}}>
                                        忘记密码？通过登录重设
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </View>
        );
    }
}