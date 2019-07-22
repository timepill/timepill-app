import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    DeviceEventEmitter,
    TextInput
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Button} from "react-native-elements";

import Color from '../style/color';
import Api from '../util/api';
import Msg from '../util/msg';


export default class FeedbackPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            content: ''
        }
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '意见反馈'
              }
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    send() {
        Api.feedback(this.state.content)
            .then(() => {
                Msg.showMsg('感谢反馈 ：）');
                Navigation.pop(this.props.componentId);
            })
            .catch(e => {
                Msg.showMsg('反馈失败');
            })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Color.spaceBackground}}>
                <TextInput
                    style={{padding: 10, height: 240, margin: 10, backgroundColor: '#fff', textAlignVertical:'top'}}
                    underlineColorAndroid='transparent'
                    selectionColor={Color.light}
                    autoCorrect={false}

                    multiline={true}
                    maxLength={1000}
                    
                    value={this.state.content}
                    onChangeText={(text) => this.setState({content: text})}
                />
                <Button borderRadius={999} title={'发送'} backgroundColor={Color.primary}
                    onPress={this.send.bind(this)}
                />
            </View>
        );
    }
}