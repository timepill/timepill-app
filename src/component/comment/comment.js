import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet-api';
import moment from 'moment';

import Color from '../../style/color';
import UserIcon from '../userIcon';


export default class Comment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comment: props.comment,

            isMyDiary: props.isMyDiary || false,
            isMyComment: props.isMyComment || false,
            expired: props.expired || false
        };
    }

    render() {
        let comment = this.state.comment;
        let user = comment.user;

        let isMyDiary = this.state.isMyDiary;
        let isMyComment = this.state.isMyComment;
        let expired = this.state.expired;

        const isNewComment = this.props.newCommentIds != null
            && this.props.newCommentIds.some(it => it === comment.id);

        const bgActive = isNewComment ? {backgroundColor: Color.textSelect} : null;

        return (
            <View style={bgActive}>
                <View style={localStyle.box}>
                    <UserIcon iconUrl={user.iconUrl} onPress={this.props.onUserIconPress}></UserIcon>

                    <View style={localStyle.body}>
                        <View style={localStyle.title}>
                            <Text style={localStyle.titleName}>{user.name}</Text>
                            <Text style={[localStyle.titleText]}>{moment(comment.created).format('H:mm')}</Text>
                        </View>
                        {
                            comment.recipient == null
                            ? <Text style={localStyle.content}>{comment.content}</Text>
                            : (
                                <Text style={localStyle.content}>
                                    <Text style={{color: Color.primary}}>@{comment.recipient.name} </Text>
                                    {comment.content}
                                </Text>
                            )
                        }
                    </View>
                </View>

                {
                    (isMyDiary) && !expired
                    ? <TouchableOpacity onPress={this.props.onCommentAction} style={localStyle.moreIcon}>
                        <Ionicons name="ios-more" size={24} color={Color.inactiveText} />
                    </TouchableOpacity>
                    : null
                }

                <View style={localStyle.line}/>

            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    box: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row'
    },
    body: {
        flexDirection: 'column',
        flexGrow: 1,
        flexShrink: 1,
        paddingTop: 2
    },
    title: {
        flexDirection: 'row',
        paddingBottom: 5,
        alignItems: 'flex-end'
    },
    titleName: {
        flexGrow: 1,
        fontWeight: 'bold',
        color: Color.text,
        fontSize: 14,
        marginRight: 5
    },
    titleText: {
        fontSize: 12,
        color: Color.inactiveText,
        paddingRight: 10
    },
    content: {
        flexGrow: 1,
        lineHeight: 26,
        color: Color.text,
        fontSize: 15,
        paddingRight: 5,
        marginBottom: 10
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Color.line,
        marginHorizontal: 16,
        marginLeft: 56
    },
    moreIcon: {
        position: 'absolute',
        bottom: 0,
        right: 15,
        paddingHorizontal: 12,
        paddingVertical: 5
    }
});