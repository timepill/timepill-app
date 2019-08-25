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
    Alert,
    StatusBar,
    DeviceEventEmitter,
    Linking
} from 'react-native';
import {Input} from "react-native-elements";
import {Navigation} from 'react-native-navigation';

import Color from './src/style/color';
import Api from './src/util/api';
import BottomNav from './src/nav/bottomNav';

import Loading from './src/component/loading';
import LoginForm from './src/component/loginForm';
import RegisterEmailForm from './src/component/registerEmailForm';
import RegisterMobileForm from './src/component/registerMobileForm';


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            page: App.pageLogin,
            
            isLoading: false,
            paddingAnim: new Animated.Value(100)

        });
    }

    componentWillMount () {
        this.keyboardDidShowListener =
            Keyboard.addListener(Api.IS_IOS ? 'keyboardWillShow' : 'keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener =
            Keyboard.addListener(Api.IS_IOS ? 'keyboardWillHide' : 'keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        Animated.timing(
            this.state.paddingAnim,
            {
                toValue: Api.IS_IOS ? 65 : 35,
                duration: 250
            }
        ).start();
    };

    _keyboardDidHide = () => {
        InteractionManager.runAfterInteractions(() => {
            Animated.timing(
                this.state.paddingAnim,
                {toValue: 100, duration: 250 }
            ).start();
        });
    };

    static pageLogin = 1;
    static pageRegisterMobile = 2;
    static pageRegisterEmail = 3;

    _setLoading(value) {
        this.setState({isLoading: value});
    }

    _onSucc() {
        Navigation.setRoot(BottomNav.config());
    }

    render() {
        return (
          <View style={localStyle.wrap}>
            <Loading visible={this.state.isLoading}></Loading>
            <Animated.View style={[localStyle.content, {paddingTop: this.state.paddingAnim}]}>
                {this.renderForm()}
                
                <View style={localStyle.bottom}>
                    <TouchableOpacity onPress={() => {
                        LayoutAnimation.easeInEaseOut();
                        if(this.state.page == App.pageLogin) {
                            this.setState({page: App.pageRegisterMobile});
                        } else {
                            this.setState({page: App.pageLogin});
                        }
                    }}>
                        <Text style={localStyle.bottomText}>
                            {this.state.page == App.pageLogin ? '没有账号？注册一个' : '已有账号？马上登录'}
                        </Text>
                    </TouchableOpacity>

                    {this.renderActionLink()}

                </View>
            </Animated.View>
          </View>
        );
    }

    renderForm() {
        if(this.state.page == App.pageLogin) {
            return (
                <LoginForm
                    setLoading={this._setLoading.bind(this)}
                    onLoginSucc={this._onSucc.bind(this)}
                ></LoginForm>
            );

        } else if(this.state.page == App.pageRegisterMobile) {
            return (
                <RegisterMobileForm
                    setLoading={this._setLoading.bind(this)}
                    onRegisterSucc={this._onSucc.bind(this)}
                ></RegisterMobileForm>
            );

        } else if(this.state.page == App.pageRegisterEmail) {
            return (
                <RegisterEmailForm
                    setLoading={this._setLoading.bind(this)}
                    onRegisterSucc={this._onSucc.bind(this)}
                ></RegisterEmailForm>
            );
        }

        return null;
    }

    renderActionLink() {
        if(this.state.page == App.pageLogin) {
            return (
                <TouchableOpacity onPress={() => {
                    Linking.openURL("https://timepill.net/home/forgot_password");
                }}>
                    <Text style={localStyle.bottomText}>
                        忘记密码？
                    </Text>
                </TouchableOpacity>
            );
        } else if(this.state.page == App.pageRegisterMobile) {
            return (
                <TouchableOpacity onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    this.setState({page: App.pageRegisterEmail});
                }}>
                    <Text style={localStyle.bottomText}>
                        邮箱注册
                    </Text>
                </TouchableOpacity>
            );
        } else if(this.state.page == App.pageRegisterEmail){
            return (
                <TouchableOpacity onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    this.setState({page: App.pageRegisterMobile});
                }}>
                    <Text style={localStyle.bottomText}>
                        手机注册
                    </Text>
                </TouchableOpacity>
            );
        }

        return null;
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
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
