import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import Color from '../../style/color';
import UserIcon from '../userIcon';
import Photo from '../photo';

import CommentList from '../comment/commentList';


export default class DiaryFull extends Component {

    constructor(props) {
        super(props);
        
        this.diary = props.diary;
        this.editable = props.editable || false;
    }

    refreshDiaryContent() {
        // empty
    }

    async refreshComment() {
        await this.commentList.refresh();
    }

    render() {
        let diary = this.diary;
        if(!diary) {
            return null;
        }
        
        let user = diary.user;

        return (
            <View>
                <View style={localStyle.box}>
                    {user && user.iconUrl
                        ? <UserIcon iconUrl={user.iconUrl}></UserIcon> : null}
                    
                    <View style={localStyle.body}>
                        <View style={localStyle.title}>
                            {user && user.name
                            ? ( <Text style={localStyle.titleName} numberOfLines={1}>
                                    {user.name}
                                </Text>
                            ) : null}

                            <Text style={[localStyle.titleText, {flex: 1}]} numberOfLines={1}>
                                《{diary.notebook_subject}》
                            </Text>
                            <Text style={localStyle.titleText}>
                                {moment(diary.created).format('H:mm')}
                            </Text>
                        </View>

                        <Text style={localStyle.content}>
                            {diary.content.trim()}
                        </Text>

                        <Photo uri={diary.photoThumbUrl}></Photo>
                    </View>
                </View>

                <CommentList ref={(r) => this.commentList = r}
                    diaryId={diary.id}
                    editable={this.editable}
                ></CommentList>

            </View>
        );
    }
}


const localStyle = StyleSheet.create({
    box: {
        flexDirection: "row",
        overflow: "hidden",
        paddingHorizontal: 15,
        paddingTop: 15,
        marginBottom: 30
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
    }
});
