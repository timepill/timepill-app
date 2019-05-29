import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ActivityIndicator,
    TextInput,
    Modal,
    TouchableOpacity,
    Keyboard,
    Animated,
    LayoutAnimation,
    InteractionManager,
    Alert, StatusBar, DeviceEventEmitter, Linking
} from 'react-native';
import {Input} from "react-native-elements";
import {Navigation} from 'react-native-navigation';

import Color from './src/style/color'
import Api from './src/util/api'

import Loading from './src/component/loading'
import LoginForm from './src/component/loginForm'
import RegisterForm from './src/component/registerForm'


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            isLoginPage: true,
            isLoading: false
        });
    }

    _setLoading(value) {
        this.setState({isLoading: value});
    }

    _toWeb() {
        Linking.openURL("https://timepill.net/home/forgot_password");
    }

    _switchForm() {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            isLoginPage: !this.state.isLoginPage
        });
    }

    render() {
        return (
          <View style={localStyle.wrap}>
            <Loading visible={this.state.isLoading}></Loading>
            <Animated.View style={localStyle.content}>
                {this.state.isLoginPage
                  ? (<LoginForm setLoading={this._setLoading.bind(this)}></LoginForm>)
                  : (<RegisterForm></RegisterForm>)}
                
                <View style={localStyle.bottom}>
                    <TouchableOpacity onPress={this._switchForm.bind(this)}>
                        <Text style={localStyle.bottomText}>
                            {this.state.isLoginPage ? '没有账号？注册一个' : '已有账号？马上登录'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._toWeb.bind(this)}>
                        <Text style={localStyle.bottomText}>
                            忘记密码？
                        </Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
          </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
        paddingTop: 65,
        paddingHorizontal: 15
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 22,
        paddingHorizontal: 5
    },
    bottomText: {
        fontSize: 14,
        color: Color.primary,
        padding: 10
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
});