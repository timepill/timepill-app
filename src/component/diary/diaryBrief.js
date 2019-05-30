import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import Color from '../../style/color';
import UserIcon from '../userIcon';
import Photo from '../photo';


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
                    {diary.content}
                </Text>

                <Photo uri={diary.photoThumbUrl} onPress={this.props.onPhotoPress}></Photo>

                <View style={localStyle.actionBar}>
                    {
                        diary.comment_count > 0
                        ? <View style={localStyle.commentIconBox}>
                            <Ionicons name="ios-text-outline" size={18}
                                  color={Color.inactiveText}
                                  style={localStyle.buttonIcon} />
                            <Text style={localStyle.commentIconText}>{diary.comment_count}</Text>
                        </View>
                        : null
                    }
                    <View style={{flex: 1}} />
                    {
                        this.editable
                        ? <TouchableOpacity onPress={this.props.onDiaryAction}>
                            <Ionicons name="ios-more" size={24}
                                      color={Color.inactiveText}
                                      style={localStyle.moreIcon} />
                        </TouchableOpacity>
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
    },
    moreIcon: {
        paddingVertical: 5,
        paddingHorizontal: 5
    },
    commentIconBox: {
        flexDirection: "row"
    },
    buttonIcon: {
        marginRight: 8,
        marginLeft: 2
    },
    commentIconIext: {
        fontSize: 15,
        color: Color.inactiveText
    }
});
