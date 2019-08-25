import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    DeviceEventEmitter,
    Keyboard,
    SafeAreaView
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import KeyboardSpacer from "react-native-keyboard-spacer";
import {Button} from 'react-native-elements';

import Color from '../style/color';
import {Icon} from '../style/icon';
import Msg from '../util/msg';
import Api from '../util/api';
import Event from '../util/event';

import DiaryFull from '../component/diary/diaryFull';
import DiaryAction from '../component/diary/diaryAction';
import CommentInput from '../component/comment/commentInput';
import { getBottomSpace } from 'react-native-iphone-x-helper';

function get_now() {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const offset = 8;   //东 8 区
    const beijingTime = utc + (3600000 * offset);

    return new Date(beijingTime);
}

function getTodayStr() {
    let now = get_now();
    
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();

    return year + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date);
}

export default class DiaryDetailPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            selfInfo: null,

            diaryId: props.diaryId,
            diary: props.diary,
            user: props.user,

            isMine: false,
            todayCreated: false,
            expired: props.expired || false,

            needScrollToBottom: false,

            error: null
        }
    }

    static options(passProps) {
        let topBar = {
            title: {
                text: '日记详情'
            }
        }

        return {
            topBar,
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        if(!this.state.selfInfo || !this.state.diary) {
            return;
        }

        if(this.state.isMine) {
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
                    Api.report(this.state.diary.user_id, this.state.diary.id).catch((err) => console.log(err))
                    Msg.showMsg('举报成功，感谢你的贡献 :)');
                }
            });
        }
    }

    componentDidMount() {
        Api.getSelfInfoByStore()
            .then(user => {
                this.setState({
                    selfInfo: user

                }, () =>{
                    this.refreshDiary(this.state.diary);
                });

            }).catch((err) => console.log(err))

        this.diaryListener = DeviceEventEmitter.addListener(Event.updateDiarys, (param) => {
            if(param != 'del') {
                this.refreshDiary();
            }
        });

        this.commentListener = DeviceEventEmitter.addListener(Event.updateComments, (param) => {
            this.setState({needScrollToBottom: true});

            this.refreshDiary();
            this.diaryFull.refreshComment();
            
            Keyboard.dismiss();
        });
    }

    componentWillUnmount(){
        this.diaryListener.remove();
        this.commentListener.remove();
    }

    async refreshDiary(diary) {
        if(!diary) {
            let diaryId = this.state.diaryId;
            if(!diaryId) {
                diaryId = this.state.diary.id;
            }

            try {
                diary = await Api.getDiary(diaryId);
            } catch(e) {
                this.setState({
                    error: e
                });

                return;
            }
        }

        let isMine = this.state.selfInfo.id == diary.user_id;

        let createdTime = diary.created;
        let todayCreated = getTodayStr() == createdTime.substring(0, createdTime.indexOf(' '));

        this.setState({
            diary,
            isMine,
            todayCreated

        }, () => {
            if(this.props.refreshBack) {
                this.props.refreshBack(diary);
            }

            if(todayCreated || (this.props.expired && !isMine)) {
                Navigation.mergeOptions(this.props.componentId, {
                    topBar: {
                        rightButtons: [{
                            id: 'navButtonMore',
                            icon: Icon.navButtonMore,
                        }]
                    }
                });
            }
        });
    }

    render() {
        if(this.state.error) {
            return (
                <View style={localStyle.container}>
                    <Text style={localStyle.text}>{'日记加载失败:('}</Text>
                    <Button fontSize={14} borderRadius={999} backgroundColor={Color.primary}
                          title={'刷新一下'}
                          onPress={() => this.refreshDiary()} />
                </View>
            );

        } else if(!this.state.selfInfo || !this.state.diary) {
            return null;
        }

        return (
            <SafeAreaView style={localStyle.wrap}>
                <ScrollView ref={(r)=>this.scroll = r}
                    style={{flex: 1, backgroundColor: 'white'}}
                    onContentSizeChange={(width, height) => {
                        if(this.props.needScrollToBottom || this.state.needScrollToBottom) {
                            this.scroll.scrollTo({y: height});
                            this.setState({needScrollToBottom: false});
                        }
                    }}
                >

                    <DiaryFull ref={(r) => this.diaryFull = r}
                        {...this.props}
                        diary={this.state.diary}
                        selfInfo={this.state.selfInfo}
                        isMine={this.state.isMine}
                        expired={this.state.expired || !this.state.todayCreated}
                    ></DiaryFull>

                </ScrollView>
                
                {
                    this.state.todayCreated  ? (
                        <CommentInput ref={(r) => this.commentInput = r}
                            diary={this.state.diary}
                            selfInfo={this.state.selfInfo}
                        ></CommentInput>
                    ) : null
                }

                {
                    Api.IS_IOS ? <KeyboardSpacer topSpacing={-getBottomSpace()} /> : null
                }
            </SafeAreaView>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Color.navBackground,
    },
    container: {
        alignItems:'center',
        justifyContent: 'center',
        height: '100%'
    },
    text: {
        paddingBottom: 15,
        color: Color.text
    }
});
