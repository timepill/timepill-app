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

    render() {
        return (
          <View style={localStyle.wrap}>
                <DiaryList ref={(r) => this.list = r}
                    dataSource={this.dataSource}
                    {...this.props}

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
