import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Api from '../util/api';

import DiaryList from '../component/diary/diaryList'
import HomeListData from '../dataLoader/homeListData';


export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.dataSource = new HomeListData();
    }

    renderHeader() {
        return (
            <View style={localStyle.header}>
                <Text style={localStyle.title}>胶囊日记</Text>
            </View>
        );
    }

    render() {
        return (
          <View style={localStyle.wrap}>
                <DiaryList ref={(r) => this.list = r}
                    dataSource={this.dataSource}
                    header={this.renderHeader.bind(this)}

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
