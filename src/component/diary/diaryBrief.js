import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import Touchable from '../touchable';
import Color from '../../style/color';
import UserIcon from '../userIcon';
import Photo from '../photo';

import DiaryIconComment from './diaryIconComment';
import DiaryIconOkB from './diaryIconOkB';
import DiaryAction from './diaryAction';


export default class DiaryBrief extends Component {

    constructor(props) {
        super(props);

        this.state = {
            diary: props.diary,

            isMine: props.isMine || false,
            expired: props.expired || false
        }

        this.showField = ['userIcon', 'userName', 'subject', 'createdTime'];
        if(props.showField && props.showField.length > 0) {
            this.showField = props.showField
        }
    }

    show(field) {
        return this.showField.indexOf(field) >= 0;
    }

    onDiaryAction() {
        DiaryAction.action(this.props.componentId, this.state.diary);
    }

    refreshDiary(diary) {
        if(diary && this.props.refreshBack) {
            this.props.refreshBack(diary);
        }
    }

    render() {
      let diary = this.state.diary;
      if(!diary) {
        return null;
      }

      let isMine = this.state.isMine;
      let expired = this.state.expired;

      let user = diary.user;

      return (
        <Touchable onPress={() => this.props.onDiaryPress ? this.props.onDiaryPress(this.state.diary) : null}>
        <View style={[localStyle.box, this.props.style]}>
            {(user && user.iconUrl && this.show('userIcon'))
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
                    {diary.content}
                </Text>

                <Photo uri={diary.photoThumbUrl} onPress={this.props.onPhotoPress}></Photo>

                <View style={localStyle.actionBar}>
                    <View style={{flex: 1}} />

                    <View style={localStyle.icons}>
                        <DiaryIconComment count={diary.comment_count}></DiaryIconComment>
                        <DiaryIconOkB diaryId={diary.id}
                            count={diary.like_count}
                            active={diary.liked}
                            clickable={!this.state.expired}
                            refreshBack={this.refreshDiary.bind(this)}
                        ></DiaryIconOkB>
                    </View>
                    
                    {
                        isMine && !expired
                        ? <TouchableOpacity onPress={this.onDiaryAction.bind(this)}>
                            <Ionicons name="ios-more" size={24}
                                      color={Color.inactiveText}
                                      style={localStyle.moreIcon} />
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>
            
        </View>
        </Touchable>
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
        paddingBottom: 5,
        paddingRight: 9
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
    },
    icons: {
        flexDirection: 'row'
    },
    moreIcon: {
        marginLeft: 7,
        marginRight: 13
    }
});
