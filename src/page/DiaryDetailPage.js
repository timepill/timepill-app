import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import {Icon} from '../style/icon';
import Msg from '../util/msg';
import Api from '../util/api'

import DiaryFull from '../component/diary/diaryFull';
import CommentInput from '../component/comment/commentInput'


export default class DiaryDetailPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.diary = props.diary;
        this.user = props.user;

        this.editable = props.editable || false;
        this.onDiaryAction = props.onDiaryAction || (() => {});
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '日记详情'
              },
              rightButtons: [{
                  id: 'navButtonMore',
                  icon: Icon.navButtonMore,

                  color: Color.primary // android
              }]
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        if(this.editable) {
            this.onDiaryAction();

        } else {
            ActionSheet.showActionSheetWithOptions({
                options: ['举报', '取消'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0

            }, (index) => {
                if(index == 0) {
                    // Api.report(this.diary.user_id, this.diary.id).done();
                    Msg.showMsg('举报成功，感谢你的贡献 :)');
                }
            });
        }
    }

    render() {
        return (
            <View style={localStyle.wrap}>
                <ScrollView style={{flex: 1}}>
                    <DiaryFull diary={this.props.diary} editable={this.editable}></DiaryFull>
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
