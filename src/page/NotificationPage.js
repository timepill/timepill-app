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
import firebase from 'react-native-firebase';

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
                this.initAndroid().catch((err) => console.log(err))
            } else {
                this.initIOS().catch((err) => console.log(err))
            }

            this.restartTipTimer().catch((err) => console.log(err))
        });
        this.loginListener = DeviceEventEmitter.addListener(Event.login, () => {
            this.registerUser().catch((err) => console.log(err));
            this.restartTipTimer().catch((err) => console.log(err))
        });
        this.updatePushInfo();
    }

    componentWillUnmount() {
        this.loginListener.remove();
        clearTimeout(this.tipTimer);
        Push.removeReceiveNotificationListener(this.receiveNotification);
    }

    updatePushInfo() {
        Api.updatePushInfo().catch((err) => console.log(err))
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
            console.log('get tips, time:', Date());
            this.refresh();
        }, this.loopTime)
    }

    async initAndroid() {
        Push.init((msg) => {
            console.log("push init: " + msg);
            this.registerUser();
            Push.addReceiveNotificationListener(this.receiveNotification);
        })
    }

    async initIOS() {
        Push.init((msg) => {
            console.log("push init: " + msg);
            this.registerUser();
            Push.addReceiveNotificationListener(this.receiveNotification);
        })
    }

    receiveNotification = (msg) => {
        this.refresh();
        this.restartTipTimer().catch((err) => console.log(err))
    };

    async registerUser() {
        const user = await Api.getSelfInfoByStore();
        if (!user || !user.id) return;
        //const settings = await Api.getSettings();
        //const push = settings['pushMessage'];
        const push = true;
        const alias = push ? user.id.toString() : user.id.toString() + '_close';
        console.log("Push.setAccount...");
        Push.setAccount(alias, success => {
            console.log('Push.setAccount ' + alias + '  ', success);
        });

        console.log(user, user.email);

        if(Platform.OS === 'ios') { //todo: android会弹出设备不支持 gppgle play 服务，暂时没解决
            firebase.crashlytics().setUserIdentifier(user.id.toString());
            firebase.crashlytics().setUserName(user.name);
            //todo:现在用户信息里没有 email
            //firebase.crashlytics().setUserEmail(user.email);
        }
    }


    _onRefresh() {
        this.restartTipTimer().catch((err) => console.log(err))
    }

    _onRefreshed(msgCount) {
        if(msgCount > 99) {
            msgCount = 99;
        }
        Navigation.mergeOptions(this.props.componentId, {
            bottomTab: {
                badge: msgCount > 0 ? msgCount.toString() : (Platform.OS === 'ios' ? null : ''),
            }
        });
    }

    refresh() {
        if(this.list) {
            this.list.refresh(false);
        }
    }

    _onDeletePress(msg) {
        this._setRead(msg).catch((err) => console.log(err))
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <NotificationList ref={(r) => {this.list = r}}
                                  isHistory={false}
                                  onRefresh={this._onRefresh.bind(this)}
                                  onRefreshed={this._onRefreshed.bind(this)}
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