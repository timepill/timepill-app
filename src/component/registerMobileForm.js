import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, InteractionManager, Alert} from 'react-native';
import {FormInput, Button} from "react-native-elements";
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import Api from '../util/api';
import Msg from '../util/msg';


export default class RegisterMobileForm extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            nickname: '',

            mobile: '',
            mobileSendTime: 0,
            code: '',
            
            password: ''
        });

        this.timer = setInterval(() => {
            if(this.state.mobileSendTime > 0) {
                this.setState({mobileSendTime: this.state.mobileSendTime - 1})
            }
        }, 1000)
    }

    componentWillUnmount () {
        clearInterval(this.timer)
    }

    requestCode() {
        if (!this.state.mobile) {
            Msg.showMsg('请输入手机');
            return;
        }

        Api.sendRegisterVerificationCode(this.state.mobile)
            .then(() => {
                this.setState({mobileSendTime: 60});
                Msg.showMsg('验证码已发送');
            })
            .catch(e => {
                Msg.showMsg('验证码发送失败');
            })
    };

    async register() {
        let isRegisterSucc, errMsg = '注册失败';

        try {
            isRegisterSucc = await Api.mobileRegister(this.state.nickname, this.state.mobile, this.state.password, this.state.code)
        } catch (err) {
            errMsg = err.message;
        }

        return {
            isRegisterSucc,
            errMsg
        }
    }

    _checkResult(result) {
        InteractionManager.runAfterInteractions(() => {
            if(result.isRegisterSucc) {
                this.props.onRegisterSucc();

            } else {
                Alert.alert(
                    result.errMsg,
                    '',
                    [
                        {text: '确定', onPress: () => {}},
                    ],
                    {cancelable: false}
                )
            }
        })
    }

    _clickRegister() {
        if(!this.state.nickname) {
            Msg.showMsg('请输入名字');
            return;
        }
        if(!this.state.mobile) {
            Msg.showMsg('请输入手机');
            return;
        }
        if(!this.state.code) {
            Msg.showMsg('请输入验证码');
            return;
        }
        if(!this.state.password) {
            Msg.showMsg('请输入密码');
            return;
        }

        this.props.setLoading(true);
        this.register().then(result => {
            this.props.setLoading(false);
            this._checkResult(result);
        });
    }

    render() {return (
        <View>
            <Text style={localStyle.title}>{'注册胶囊日记账号'}</Text>

            <View style={localStyle.form}>
                <FormInput

                    selectionColor={Color.primary}
                    underlineColorAndroid='transparent'
                    keyboardType='email-address'
                    value={this.state.nickname}
                    
                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize='none'
                    
                    placeholderTextColor={Color.inactiveText}
                    placeholder='名字'
                    returnKeyType='next'

                    onChangeText={(text) => this.setState({nickname: text})}
                    onSubmitEditing={() => {}}
                />

                <View style={{flexDirection:"row"}}>
                    <FormInput ref='inputMobile'
                        containerStyle={{flex: 1}}
                        underlineColorAndroid='transparent'
                        selectionColor={Color.primary}

                        keyboardType='phone-pad'
                        value={this.state.mobile}

                        autoCorrect={false}
                        autoFocus={false}
                        autoCapitalize='none'

                        placeholder='手机号'
                        placeholderTextColor={Color.inactiveText}
                        returnKeyType='next'

                        onChangeText={(text) => this.setState({mobile: text})}
                        onSubmitEditing={() => {}}
                    />
                    
                    <Button title={this.state.mobileSendTime == 0 ? "发送验证码" : (this.state.mobileSendTime) + '秒后重发'}
                        disabled={this.state.mobileSendTime > 0}

                        large={false}
                        borderRadius={999}
                        backgroundColor={Color.primary}
                        style={{marginBottom: 0, marginTop:5, marginRight:5, marginLeft:-15}}
                        buttonStyle={Platform.OS === 'ios' ? {
                            paddingVertical:8,
                            paddingHorizontal:12,
                            width: 90
                        } : { width: 90 }}
                        textStyle={{fontWeight: 'bold', fontSize: 12, fontFamily:"Helvetica"}}

                        onPress={this.requestCode.bind(this)}
                    />
                </View>
                <FormInput ref='inputCode'
                    underlineColorAndroid='transparent'
                    selectionColor={Color.primary}

                    keyboardType='phone-pad'
                    value={this.state.code}

                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize='none'

                    placeholder='验证码'
                    placeholderTextColor={Color.inactiveText}
                    returnKeyType='next'

                    onChangeText={(text) => this.setState({code: text})}
                    onSubmitEditing={() => {}}
                />

                <FormInput ref='registerMobilePw'

                    selectionColor={Color.primary}
                    underlineColorAndroid='transparent'

                    value={this.state.password}
                    secureTextEntry={true}
                    selectTextOnFocus={true}
                    autoCorrect={false}
                    
                    placeholder='登录密码'
                    placeholderTextColor={Color.inactiveText}
                    returnKeyType='done'

                    onChangeText={(text) => this.setState({password: text})}
                    onSubmitEditing={this._clickRegister.bind(this)}
                />
            </View>

            <Button borderRadius={999} title={'注册'}
                backgroundColor={Color.primary}
                onPress={this._clickRegister.bind(this)}
            />
        </View>
    );}
}

const localStyle = StyleSheet.create({
    title: {
        fontSize: 26,
        paddingBottom: 35,
        color: '#222',
        textAlign: 'center'
    },
    form: {
        paddingBottom: 20,
    }
});