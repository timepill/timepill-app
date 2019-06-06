import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, InteractionManager, Alert} from 'react-native';
import {FormInput, Button} from "react-native-elements";
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import Api from '../util/api';
import Msg from '../util/msg';


export default class RegisterEmailForm extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            nickname: '',
            username: '',
            password: ''            
        });
    }

    async register() {
        let isRegisterSucc, errMsg = '注册失败';

        try {
            isRegisterSucc = await Api.register(this.state.nickname, this.state.username, this.state.password);
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
        if(!this.state.username) {
            Msg.showMsg('请输入邮箱');
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

                <FormInput ref='inputEmail'

                    selectionColor={Color.primary}
                    underlineColorAndroid='transparent'
                    keyboardType='email-address'
                    value={this.state.username}

                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize='none'
                    
                    placeholderTextColor={Color.inactiveText}
                    placeholder='邮箱'
                    returnKeyType='next'

                    onChangeText={(text) => this.setState({username: text})}
                    onSubmitEditing={() => {}}
                />

                <FormInput ref='registerEmailPw'

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