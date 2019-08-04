import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import moment from 'moment';

import Color from '../../style/color';
import UserIcon from '../userIcon';
import Photo from '../photo';

import CommentList from '../comment/commentList';
import DiaryIconOkB from './diaryIconOkB';


export default class DiaryFull extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            diary: props.diary,
            selfInfo: props.selfInfo,

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

    componentWillReceiveProps(nextProps) {
        this.setState({
            diary: nextProps.diary,
            selfInfo: nextProps.selfInfo,

            isMine: nextProps.isMine || false,
            expired: nextProps.expired || false
        });
    }

    async refreshComment() {
        await this.commentList.refresh();
    }

    _onUserIconPress() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'User',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    user: this.state.diary.user
                }
            }
        });
    }

    _onPhotoPress(photoUrl) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Photo',
                passProps: {
                    url: photoUrl
                }
            }
        })
    }


    render() {
        let diary = this.state.diary;
        if(!diary) {
            return null;
        }
        
        let user = diary.user;

        return (
            <View>
                <View style={localStyle.box}>
                    {user && user.iconUrl && this.show('userIcon')
                        ? <UserIcon iconUrl={user.iconUrl} onPress={this._onUserIconPress.bind(this)}></UserIcon> : null}
                    
                    <View style={localStyle.body}>
                        <View style={localStyle.title}>
                            {user && user.name && this.show('userName')
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

                        <Text style={localStyle.content} selectable={true} selectionColor={Color.textSelect}>
                            {diary.content.trim()}
                        </Text>

                        <Photo uri={diary.photoThumbUrl} onPress={() => this._onPhotoPress(diary.photoUrl)}></Photo>
                    
                        <View style={localStyle.actionBar}>
                            <DiaryIconOkB diaryId={diary.id}
                                count={diary.like_count}
                                active={diary.liked}
                                clickable={!this.state.expired}
                            ></DiaryIconOkB>
                        </View>
                    </View>
                </View>

                <CommentList ref={(r) => this.commentList = r}
                    {...this.props}
                    diaryId={diary.id}
                    isMine={this.state.isMine}
                    expired={this.state.expired}
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
        marginBottom: 1
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
        paddingRight: 9,
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
        paddingRight: 5,
        textAlignVertical: 'bottom'
    },
    actionBar: {
        flexDirection: 'row',
        width: '100%',
        height: 30,
        marginTop: 15,
        justifyContent: 'flex-end'
    }
});
