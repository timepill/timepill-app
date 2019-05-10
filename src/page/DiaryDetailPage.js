import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView} from 'react-native';

import Color from '../style/color';
import DiaryFull from '../component/diary/diaryFull';


export default class DiaryDetailPage extends Component {

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <DiaryFull diary={this.props.diary}></DiaryFull>
            </ScrollView>
      );
    }
}

const localStyle = StyleSheet.create({

});
