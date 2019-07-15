import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, InteractionManager, DeviceEventEmitter, ListView, ActivityIndicator, RefreshControl} from 'react-native';
import {Button} from 'react-native-elements'
import {Navigation} from 'react-native-navigation';

import Color from '../style/color'
import {Icon} from '../style/icon'

import {ListEmptyRefreshable} from '../component/listEmpty'
import Push from "../util/push";
import Api from "../util/api";
import Event from "../util/event";
import Notification from "../component/notification/notification";
import NotificationList from "../component/notification/notificationList";

const LOOP_TIME_SHORT = 30 * 1000;
const LOOP_TIME_LONG = 60 * 1000;

export default class NotificationPage extends Component {

    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: '提醒'
                },
                rightButtons: [{
                    id: 'history',
                    icon: Icon.navButtonTime,

                    color: Color.primary // android
                }]
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        // const ds = new ListView.DataSource({
        //     rowHasChanged: (r1, r2) => r1 !== r2
        // });
        // this.state = ({
        //     messages: [],
        //     messagesDataSource: ds,
        //     refreshing: true,
        // });
    }

    navigationButtonPressed({buttonId}) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'NotificationHistory'
            }
        });
    }

    loopTime = LOOP_TIME_LONG;
    tipTimer = null;

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (Platform.OS === 'android') {
                this.initAndroid().done()
            } else {
                this.initIOS().done()
            }

            this.restartTipTimer().done();
        });
        this.loginListener = DeviceEventEmitter.addListener(Event.login, () => {
            this.registerUser().done();
            this.restartTipTimer().done();
        });
        this.updatePushInfo().done();
    }

    componentWillUnmount() {
        this.loginListener.remove();
        //todo:删除 push 事件注册，删除定时器
    }

    async updatePushInfo() {
        let info;
        try {
            info = await Api.updatePushInfo()
        } catch (err) {
            console.error(err)
        }
        // console.log('updatePushInfo', info)
    }

    /**
     * 更新刷新定时器
     * @returns {Promise<void>}
     */
    async restartTipTimer() {
        if (this.tipTimer) {
            clearTimeout(this.tipTimer);
        }

        this.tipTimer = setTimeout(() => {
            this.refresh();
        }, this.loopTime)
    }

    async initAndroid() {
        Push.init((msg) => {
            console.log("push init: " + msg);
            this.registerUser();
            Push.addReceiveNotificationListener((msg) => {
                this.restartTipTimer().done();
            });
        })
    }

    async initIOS() {
        Push.init((msg) => {
            console.log("push init: " + msg);
            this.registerUser();
            Push.addReceiveNotificationListener((msg) => {
                this.restartTipTimer().done();
            });
        })
    }

    async registerUser() {
        const user = await Api.getSelfInfoByStore();
        if (!user || !user.id) return;
        //const settings = await Api.getSettings();
        //const push = settings['pushMessage'];
        const push = true;
        const alias = push ? user.id.toString() : user.id.toString() + '_close';
        Push.setAccount(alias, success => {
            console.log('JPushModule.setAlias ' + alias + '  ' + success);
        });

        // Crashlytics.setUserName(user.name);
        // Crashlytics.setUserEmail(user.email);
        // Crashlytics.setUserIdentifier(user.id.toString());
    }


    _onRefresh() {
        this.restartTipTimer().done();
    }

    refresh() {
        if(this.list) {
            this.list.refresh(false);
        }
    }

    _onDeletePress(msg) {
        this._setRead(msg).done();
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <NotificationList ref={(r) => {this.list = r}}
                                  isHistory={false}
                                  onRefresh={this._onRefresh.bind(this)}
                                  isSetRead={true}
                                  {...this.props}/>
            </View>
        )
    }


    renderEmpty() {
        if (this.state.refreshing) {
            return (
                <View style={{alignItems:'center', justifyContent: 'center' , height: '100%'}}>
                    <ActivityIndicator animating={true} color={Color.primary} size={Platform.OS === 'android' ? 'large' : 'small'}/>
                </View>
            )
        }
        let text = this.state.error ? '出错了 :(':'没有提醒 :)';
        return (
            <ListEmptyRefreshable message={text}/>
        );
    }
}

const styles = StyleSheet.create({
    message: {
        padding: 20,
        borderColor: Color.line,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row'
    },
    icon: {
        marginRight: 10,
        marginTop: 1,
        lineHeight: 20,
    },
    delete: {
        lineHeight: 20,
        paddingHorizontal: 8,
    }
});