import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import Color from '../../style/color';
import UserIcon from '../userIcon';

import CommentActionIcon from './commentActionIcon';


export default class Comment extends Component {

    render() {
        let comment = this.props.comment;
        let user = comment.user;
        let editable = this.props.editable;

        return (
            <View>
                <View style={localStyle.box}>
                    <UserIcon iconUrl={user.iconUrl}></UserIcon>

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
                    editable
                    ? <CommentActionIcon></CommentActionIcon>
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
        color: Color.inactiveText
    },
    content: {
        flexGrow: 1,
        lineHeight: 26,
        color: Color.text,
        fontSize: 15,
        marginBottom: 10
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Color.line,
        marginHorizontal: 16,
        marginLeft: 56
    }
});