import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Api from '../util/api'

import DiaryList from '../component/diary/diaryList'
import FollowListData from '../dataLoader/followListData';


export default class FollowPage extends Component {

    constructor(props) {
        super(props);
        this.dataSource = new FollowListData();
    }

    _onDiaryPress(diary) {
        console.log('componentId:', this.props.componentId, diary);
        Navigation.push(this.props.componentId, {
            component: {
                name: 'DiaryDetail',
                passProps: {
                    diary: diary
                }
            }
        });
        
    }

    renderHeader() {
        return (
            <View style={localStyle.header}>
                <Text style={localStyle.title}>关注</Text>
            </View>
        );
    }

    render() {
        return (
          <View style={localStyle.wrap}>
                <DiaryList ref={(r) => this.list = r}
                    dataSource={this.dataSource}
                    header={this.renderHeader.bind(this)}
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
        backgroundColor: '#fff',
        paddingTop: 20
    },
    header: {
        paddingLeft: 20,
        flexDirection: "row"
    },
    title: {
        flex: 1,
        fontSize: 30,
        color: '#000'
    }
});
