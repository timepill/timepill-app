import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import Color from '../../style/color';
import UserIcon from '../userIcon';
import Photo from '../photo';

import CommentIcon from '../comment/commentIcon';
import DiaryActionIcon from './diaryActionIcon';


export default class DiaryBrief extends Component {

    render() {
      let diary = this.props.diary;
      let user = diary.user;
      let editable = this.props.editable;

      return (
        <View style={localStyle.box}>
            <UserIcon iconUrl={user.iconUrl}></UserIcon>
            <View style={localStyle.body}>
                <View style={localStyle.title}>
                    <Text style={localStyle.titleName} numberOfLines={1}>
                        {user.name}
                    </Text>
                    <Text style={[localStyle.titleText, {flex: 1}]} numberOfLines={1}>
                        《{diary.notebook_subject}》
                    </Text>
                    <Text style={localStyle.titleText}>
                        {moment(diary.created).format('H:mm')}
                    </Text>
                </View>

                <Text style={localStyle.content} numberOfLines={5}>
                    {diary.content.trim()}
                </Text>

                <Photo uri={diary.photoThumbUrl}></Photo>

                <View style={localStyle.actionBar}>
                    {
                        diary.comment_count > 0
                        ? <CommentIcon count={diary.comment_count}></CommentIcon>
                        : null
                    }
                    <View style={{flex: 1}} />
                    {
                        editable
                        ? <DiaryActionIcon></DiaryActionIcon>
                        : null
                    }
                </View>
            </View>
            
        </View>
      );
    }
}

const localStyle = StyleSheet.create({
    box: {
        flexDirection: "row",
        overflow: "hidden",
        paddingHorizontal: 15,
        paddingTop: 15
    },
    body: {
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1,
        paddingTop: 2,
        paddingBottom: 5
    },
    title: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingBottom: 5
    },
    titleName: {
        fontWeight: 'bold',
        color: Color.text,
        fontSize: 14
    },
    titleText: {
        fontSize: 12,
        color: Color.inactiveText
    },
    content: {
        flexGrow: 1,
        lineHeight: 24,
        color: Color.text,
        fontSize: 15,
        textAlignVertical: 'bottom'
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: "center",
        width: '100%',
        height: 30,
        marginTop: 5,
        justifyContent: 'space-between'
    }
});
