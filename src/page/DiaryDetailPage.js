import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    DeviceEventEmitter,
    Keyboard
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import KeyboardSpacer from "react-native-keyboard-spacer";

import Color from '../style/color';
import {Icon} from '../style/icon';
import Msg from '../util/msg';
import Api from '../util/api'
import Event from '../util/event';

import DiaryFull from '../component/diary/diaryFull';
import DiaryAction from '../component/diary/diaryAction';
import CommentInput from '../component/comment/commentInput';


export default class DiaryDetailPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            selfInfo: null,

            diaryId: props.diaryId,
            diary: props.diary,
            user: props.user,

            editable: props.editable || false,
            expired: props.expired || false,
            needScrollToBottom: false
        }
    }

    static options(passProps) {
        let topBar = {
            title: {
                text: '日记详情'
            }
        }

        if(!passProps.expired) {
            topBar.rightButtons = [{
                id: 'navButtonMore',
                icon: Icon.navButtonMore,

                color: Color.primary // android
            }]
        }

        return {
            topBar
        };
    }

    navigationButtonPressed({buttonId}) {
        if(this.state.editable || this.state.diary.user_id == this.state.selfInfo.id) {
            let componentId = this.props.componentId;
            DiaryAction.action(componentId, this.state.diary, {
                onDelete: () => {
                    Navigation.pop(componentId);
                }
            });

        } else {
            ActionSheet.showActionSheetWithOptions({
                options: ['举报', '取消'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0

            }, (index) => {
                if(index == 0) {
                    Api.report(this.state.diary.user_id, this.state.diary.id).done();
                    Msg.showMsg('举报成功，感谢你的贡献 :)');
                }
            });
        }
    }

    componentDidMount() {
        if(!this.state.diary && this.state.diaryId) {
            this.refreshDiary();
        }

        Api.getSelfInfoByStore()
            .then(user => {
                this.setState({
                    selfInfo: user
                });

            }).done();

        this.diaryListener = DeviceEventEmitter.addListener(Event.updateDiarys, (param) => {
            if(param != 'del') {
                this.refreshDiary();
            }
        });

        this.commentListener = DeviceEventEmitter.addListener(Event.updateComments, (param) => {
            this.setState({needScrollToBottom: true});
            this.diaryFull.refreshComment();
            Keyboard.dismiss();
        });
    }

    componentWillUnmount(){
        this.diaryListener.remove();
        this.commentListener.remove();
    }

    refreshDiary() {
        let diaryId = this.state.diaryId;
        if(!diaryId) {
            diaryId = this.state.diary.id;
        }

        Api.getDiary(diaryId)
            .then(result => {
                if(!result) {
                    throw {
                        message: 'get diary no result'
                    }
                }

                this.props.refreshBack(result);
                this.diaryFull.refreshDiaryContent(result);
            })
            .done();
    }

    render() {
        if(!this.state.selfInfo || !this.state.diary) {
            return null;
        }

        let isMine = false;
        if(this.state.selfInfo.id == this.state.diary.user_id) {
            isMine = true;
        }

        return (
            <View style={localStyle.wrap}>
                <ScrollView ref={(r)=>this.scroll = r}
                    style={{flex: 1}}
                    onContentSizeChange={(width, height) => {
                        if(this.state.needScrollToBottom) {
                            this.scroll.scrollTo({y: height});
                            this.setState({needScrollToBottom: false});
                        }
                    }}
                >

                    <DiaryFull ref={(r) => this.diaryFull = r}
                        {...this.props}
                        diary={this.state.diary}
                        editable={this.state.editable || isMine}
                        expired={this.state.expired}
                    ></DiaryFull>

                </ScrollView>
                
                {
                    !this.state.expired ? (
                        <CommentInput ref={(r) => this.commentInput = r}
                            diary={this.state.diary}
                            selfInfo={this.state.selfInfo}
                        ></CommentInput>
                    ) : null
                }

                {
                    Api.IS_IOS ? <KeyboardSpacer topSpacing={Api.IS_IPHONEX ? -30 : 0} /> : null
                }
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column'
    }
});
