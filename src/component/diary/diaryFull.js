import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import moment from 'moment'

import Color from '../../style/color'
import UserIcon from './userIcon'


export default class DiaryFull extends Component {

    render() {
      let diary = this.props.diary;
      let user = diary.user;

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

                <Text style={localStyle.content}>
                    {diary.content}
                </Text>
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
        paddingTop: 2
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
        textAlignVertical: 'bottom',
        paddingBottom: 15
    }
});
