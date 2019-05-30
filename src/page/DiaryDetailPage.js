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
import CommentInput from '../component/comment/commentInput'


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
            needScrollToBottom: false
        }

        this.onDiaryAction = props.onDiaryAction || (() => {});
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '日记详情'
              },
              rightButtons: [{
                  id: 'navButtonMore',
                  icon: Icon.navButtonMore,

                  color: Color.primary // android
              }]
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        if(this.state.editable) {
            this.onDiaryAction(this.state.diary);

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
            this.refreshDiary();
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

                this.setState({
                    diary: result
                }, () => {
                    this.diaryFull.refreshDiaryContent();
                })
            })
            .done(() => {

            });
    }

    render() {
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
                        diary={this.state.diary}
                        refreshData={() => this.state.diary}
                        editable={this.state.editable}
                        {...this.props}
                    ></DiaryFull>

                </ScrollView>
                
                {
                    this.state.selfInfo && this.state.diary ? (
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
