import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import KeyboardSpacer from "react-native-keyboard-spacer";

import Touchable from '../touchable';
import Color from '../../style/color';
import Api from '../../util/api';
import Event from '../../util/event';

const DefaultInputHeight = 56;

export default class CommentInput extends Component {

    constructor(props) {
        super(props);

        this.selfInfo = props.selfInfo;
        this.diary = props.diary;

        this.state = {
            sending: false,

            content: '',
            replyUserId: 0,
            replyUserName: '',
            inputHeight: DefaultInputHeight,
        };
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(Event.commentPressed, (comment) => {
            if(this.selfInfo && comment.user.id === this.selfInfo.id) {
                return;
            }

            let content = this.state.content;
            if(this.state.replyUserName) {
                content = content.replace('@' + this.state.replyUserName, '@' + comment.user.name);
            } else {
                content = '@' + comment.user.name + ' ' + content;
            }

            this.setState({
                content: content,
                replyUserId: comment.user.id,
                replyUserName: comment.user.name
            }, () => {
                if(this.refs.commentInput) {
                    this.refs.commentInput.focus();
                }
            });
        });
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    sendComment() {
        let content = this.state.content;
        let replyUserId = this.state.replyUserId;
        let replyUserName = this.state.replyUserName;

        if(replyUserId && content.startsWith('@' + replyUserName + ' ')) {
            content = content.substr(replyUserName.length + 2);

        } else {
            replyUserId = 0;
            replyUserName = '';
        }

        if(!content) {
            return;
        }

        this.setState({comment_sending: true});
        Api.addComment(this.diary.id, content, replyUserId)
            .then(result => {
                if(!result) {
                    throw {
                        message: 'comment failed'
                    }
                }

                this.setState({
                    content: '',
                    replyUserId: 0,
                    replyUserName: '',
                    inputHeight: DefaultInputHeight,
                }, () => {
                    DeviceEventEmitter.emit(Event.updateComments);
                });

            })
            .catch(e => {
                Alert.alert('回复失败');
            })
            .finally(() => {
                this.setState({comment_sending: false});
            });
    }

    resetInputHeight(event) {
        let height = 0;
        if(Platform.OS === "ios") {
            //iOS 一开始是 29，只要一编辑就变成每行 18，36
            const h = event.nativeEvent.contentSize.height + 37;
            const max = 74 + 37;
            height = h > max ? max : h
        } else {
            //android 一开始是 41.5，57，75
            const h = event.nativeEvent.contentSize.height;
            const max = 107;
            if (h < DefaultInputHeight) {
                height = DefaultInputHeight;
            } else {
                height = h + (DefaultInputHeight - 40);
                height = height > max ? max : height;
            }
        }
        if (this.state.inputHeight !== height) {
            this.setState({
                inputHeight: height,
            });
        }
    }

    render() {
        return (
            <View style={[localStyle.container, { height: this.state.inputHeight }]}>
                <TextInput style={localStyle.input}
                           selectionColor={Color.light}

                           ref="commentInput"

                           placeholder="回复日记"
                           value={this.state.content}
                           
                           autoCorrect={false}
                           maxLength={500} multiline={true}
                           showsVerticalScrollIndicator={false}
                           underlineColorAndroid="transparent"
                           
                           onChangeText={(text) => {
                                let state = {
                                    content: text
                                }

                                if(!text || !text.startsWith('@'+this.state.replyUserName)) {
                                    state.replyUserId = 0;
                                    state.replyUserName = '';
                                }

                                this.setState(state);
                           }}
                           onContentSizeChange={this.resetInputHeight.bind(this)}
                />
                <TouchableOpacity style={localStyle.buttonWrap}
                    onPress={this.sendComment.bind(this)}>

                    <View style={localStyle.button}>
                        <Icon name="md-arrow-round-up" size={22} color="#fff" />
                    </View>
                </TouchableOpacity>

                {this.state.sending
                ? (
                    <View style={localStyle.sending}>
                        <ActivityIndicator animating={true} color={Color.light} size="small"/>
                    </View>
                ) : null}

            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        height: 56,
        backgroundColor: Color.navBackground,
        elevation: 3,
        borderColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth
    },
    input: {
        flexGrow: 1,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 19,
        paddingRight: 40,
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        height: 39,
        lineHeight: 20,
        fontSize: 16,
        margin: 8
    },
    buttonWrap: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingBottom: 12,
        paddingRight:12,
        paddingTop: 12
    },
    button: {
        width: 32,
        height: 32,
        backgroundColor: Color.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16
    },
    sending: {
        flexGrow: 1,
        opacity: 0.8,
        backgroundColor: "#fff",
        top: 0,
        left: 0,
        bottom:0,
        right:0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    }
});