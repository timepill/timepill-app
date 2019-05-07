import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, InteractionManager, Alert} from 'react-native';
import {Input, Button} from "react-native-elements";
import {Navigation} from 'react-native-navigation';

import Color from '../style/color'
import Api from '../util/api'


export default class RegisterForm extends Component {

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

        this.props.setLoading(true);
        try {
            isRegisterSucc = await Api.register(this.state.nickname, this.state.username, this.state.password);
        } catch (err) {
            console.log(err);
            errMsg = err.message;
        }
        this.props.setLoading(false);

        return {
            isRegisterSucc,
            errMsg
        }
    }

    _checkResult(result) {
        InteractionManager.runAfterInteractions(() => {
            if(result.isRegisterSucc) {
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: 'Home',
                        title: 'Home Title',
                    }
                });

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
        this.register().then(this._checkResult);
    }

    render() {return (
        <View>
            <Text style={localStyle.title}>{'注册胶囊日记账号'}</Text>

            <View style={localStyle.form}>
                <Input

                    selectionColor={Color.primary}
                    underlineColorAndroid='transparent'
                    keyboardType='email-address'
                    value={''}
                    
                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize='none'
                    
                    placeholderTextColor={Color.inactiveText}
                    placeholder='名字'
                    returnKeyType='next'

                    onChangeText={() => {}}
                    onSubmitEditing={() => {}}
                />

                <Input

                    selectionColor={Color.primary}
                    underlineColorAndroid='transparent'
                    keyboardType='email-address'
                    value={''}

                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize='none'
                    
                    placeholderTextColor={Color.inactiveText}
                    placeholder='账号邮箱'
                    returnKeyType='next'

                    onChangeText={() => {}}
                    onSubmitEditing={() => {}}
                />

                <Input

                    selectionColor={Color.primary}
                    underlineColorAndroid='transparent'

                    value={''}
                    secureTextEntry={true}
                    selectTextOnFocus={true}
                    autoCorrect={false}
                    
                    placeholder='登录密码'
                    placeholderTextColor={Color.inactiveText}
                    returnKeyType='done'

                    onChangeText={() => {}}
                    onSubmitEditing={() => {}}
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