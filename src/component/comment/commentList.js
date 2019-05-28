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
    DeviceEventEmitter
} from 'react-native';
import {Divider} from "react-native-elements";

import Touchable from '../touchable';
import Color from '../../style/color';
import Api from '../../util/api';
import Event from '../../util/event';
import Msg from '../../util/msg'

import Comment from './comment';


export default class CommentList extends Component {

    constructor(props) {
        super(props);

        this.diaryId = props.diaryId;
        this.editable = props.editable || false;

        this.state = {
            comments: []
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    async refresh() {
        let comments = await Api.getDiaryComments(this.diaryId);
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
                                    const filterComments = this.state.comments.filter(it => it.id !== comment.id);
                                    this.setState({
                                        comments: filterComments
                                    });
                                })
                                .catch(e => {
                                    Msg.showMsg('删除失败');
                                })
                                .done();
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

    render() {
        return (
            <View style={localStyle.container}>
                <FlatList ref={(r) => this.list = r}

                    data={this.state.comments}

                    keyExtractor={(item, index) => {
                        return item.id.toString()
                    }}

                    renderItem={({item}) => {
                        return (
                            <Touchable onPress={() => this._onCommentPress(item)}>
                                <Comment comment={item} editable={this.editable}
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