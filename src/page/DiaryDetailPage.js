import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView} from 'react-native';

import Color from '../style/color';
import DiaryFull from '../component/diary/diaryFull';
import CommentInput from '../component/comment/commentInput'


export default class DiaryDetailPage extends Component {

    render() {
        return (
            <View style={localStyle.wrap}>
                <ScrollView style={{flex: 1}}>
                    <DiaryFull diary={this.props.diary}></DiaryFull>
                </ScrollView>
                
                <CommentInput></CommentInput>

            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column'
    }
});
