import React, {Component} from 'react';
import {
    InteractionManager,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    Text,
    View,
    Alert,
    Keyboard,
    DeviceEventEmitter,
    Clipboard,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Divider} from "react-native-elements";

import Touchable from '../touchable';
import Color from '../../style/color';
import Api from '../../util/api';
import Event from '../../util/event';
import Msg from '../../util/msg';

import Comment from './comment';


export default class CommentList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            diaryId: props.diaryId,
            selfInfo: props.selfInfo,

            isMine: props.isMine || false,
            expired: props.expired || false,

            comments: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            diaryId: nextProps.diaryId,
            selfInfo: nextProps.selfInfo,

            isMine: nextProps.isMine || false,
            expired: nextProps.expired || false
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    async refresh() {
        let comments = await Api.getDiaryComments(this.state.diaryId);
        if(comments && comments.length > 0) {
            if (comments.length > 1) {
                comments = comments.reverse();
            }
            
            this.setState({
                comments
            });
        }
    }

    _onCommentPress(comment) {
        DeviceEventEmitter.emit(Event.commentPressed, comment);
    }

    _onUserIconPress(comment) {
        if(this.state.selfInfo.id == comment.user_id) {
            return;
        }

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
                    user: comment.user
                }
            }
        });
    }

    _onCommentAction(comment) {
        ActionSheet.showActionSheetWithOptions({
            options:['删除回复', '取消'],
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0

        }, (index) => {
            if(index == 0) {
                Alert.alert('提示', '确认删除回复?', [
                    {
                        text: '删除',
                        style: 'destructive',
                        onPress: () => {
                            Api.deleteComment(comment.id)
                                .then(() => {
                                    DeviceEventEmitter.emit(Event.updateComments);
                                    
                                    const filterComments = this.state.comments.filter(it => it.id !== comment.id);
                                    this.setState({
                                        comments: filterComments
                                    });
                                })
                                .catch(e => {
                                    Msg.showMsg('删除失败');
                                })
                        }
                    },
                    {
                        text: '取消',
                        onPress: () => {}
                    }
                ]);
            }
        });
    }

    _onCommentLongPress = (comment) => {
        ActionSheet.showActionSheetWithOptions({
            options: ['复制内容', '取消'],
            cancelButtonIndex: 1,
        }, (index) => {
            if (index === 0) {
                Clipboard.setString(comment.content);
            }
        });
    };

    render() {
        let selfInfo = this.state.selfInfo;

        return (
            <View style={localStyle.container}>
                <FlatList ref={(r) => this.list = r}

                    data={this.state.comments}

                    keyExtractor={(item, index) => {
                        return item.id.toString()
                    }}

                    renderItem={({item}) => {
                        return (
                            <Touchable
                                onPress={() => this._onCommentPress(item)}
                                onLongPress={() => this._onCommentLongPress(item)}
                            >
                                <Comment comment={item}
                                    {...this.props}

                                    isMyDiary={this.state.isMine}
                                    isMyComment={selfInfo.id == item.user_id}
                                    expired={this.state.expired}

                                    onUserIconPress={() => this._onUserIconPress(item)}
                                    onCommentAction={() => this._onCommentAction(item)}>
                                </Comment>
                            </Touchable>
                        )
                    }}

                    ListHeaderComponent={() => {
                        let count = this.state.comments.length;
                        return (
                            <View>
                                <View style={localStyle.line} />
                                <Text style={localStyle.header}>
                                  {count > 0 ? `共 ${count} 条回复` : '还没有人回复'}
                                </Text>
                            </View>
                        );
                    }}
                >
                </FlatList>

            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingBottom: Api.IS_IPHONEX ? 30 : 0
    },
    line: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Color.line,
        marginHorizontal: 15
    },
    header: {
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 20,
        color: Color.inactiveText
    }
});