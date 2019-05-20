import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Api from '../util/api';

import DiaryList from '../component/diary/diaryList'
import HomeDiaryData from '../dataLoader/homeDiaryData';


export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.dataSource = new HomeDiaryData();
    }

    _onDiaryPress(diary) {
        console.log('componentId:', this.props.componentId, diary);
        Navigation.push(this.props.componentId, {
            component: {
                name: 'DiaryDetail',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    diary: diary
                }
            }
        });
    }

    render() {
        return (
          <View style={localStyle.wrap}>
                <DiaryList ref={(r) => this.list = r}
                    dataSource={this.dataSource}
                    onDiaryPress={this._onDiaryPress.bind(this)}

                    navigator={this.props.navigator}

                ></DiaryList>
          </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
