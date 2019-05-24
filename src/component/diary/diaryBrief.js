import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import Color from '../../style/color';
import UserIcon from '../userIcon';
import Photo from '../photo';

import CommentIcon from '../comment/commentIcon';
import DiaryActionIcon from './diaryActionIcon';


export default class DiaryBrief extends Component {

    constructor(props) {
        super(props);

        this.diary = props.diary;
        this.editable = props.editable || false;

        this.showField = ['icon', 'userName', 'subject', 'createdTime'];
        if(props.showField && props.showField.length > 0) {
            this.showField = props.showField
        }
    }

    show(field) {
        return this.showField.indexOf(field) >= 0;
    }

    render() {
      let diary = this.diary;
      if(!diary) {
        return null;
      }

      let user = diary.user;

      return (
        <View style={[localStyle.box, this.props.style]}>
            {(user && user.iconUrl && this.show('icon'))
                ? <UserIcon iconUrl={user.iconUrl} onPress={this.props.onUserIconPress}></UserIcon> : null}

            <View style={localStyle.body}>
                <View style={localStyle.title}>
                    {(user && user.name && this.show('userName'))
                    ? ( <Text style={localStyle.titleName} numberOfLines={1}>
                            {user.name}
                        </Text>
                    ) : null}
                    {(diary.notebook_subject && this.show('subject'))
                    ? ( <Text style={[localStyle.titleText, {flex: 1}]} numberOfLines={1}>
                            《{diary.notebook_subject}》
                        </Text>
                    ) : null}
                    {(diary.created && this.show('createdTime'))
                    ? ( <Text style={localStyle.titleText}>
                            {moment(diary.created).format('H:mm')}
                        </Text>
                    ) : null}
                    
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
                        this.editable
                        ? <DiaryActionIcon diaryId={diary.id}
                            onPress={this.props.onDiaryAction}></DiaryActionIcon>
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
        marginTop: 10,
        justifyContent: 'space-between'
    }
});
