import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    DeviceEventEmitter
} from 'react-native';

import Api from '../util/api';
import Token from '../util/token';
import Event from '../util/event';
import Color from '../style/color';
import UpdateInfo from '../about/updateInfo';


export default class AboutPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            info: null,
            news: UpdateInfo
        };
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '关于'
              }
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    componentDidMount() {
        Token.setUpdateVersion(UpdateInfo.version)
            .then(() => {
                DeviceEventEmitter.emit(Event.updateNewsRead);
            });
    }

    render() {
        const label = this.state.info ? ` (${this.state.info.label})` : null;

        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <View style={{flex: 1, padding: 15, alignItems: 'center', paddingTop: 80}}>
                    <Image source={require('../about/Icon.png')}
                           style={{width: 128, height: 128, borderRadius: 28, borderWidth: 1, borderColor:"#d9d9d9"}} />
                    <Text style={{paddingTop: 20, paddingBottom: 60}}>版本: {Api.VERSION}{label}</Text>
                    <Text style={{color: Color.inactiveText}}>{this.state.news.date} 更新日志</Text>
                    <Text style={{lineHeight: 20}}>{this.state.news.info}</Text>
                </View>
            </View>
        );
    }
}