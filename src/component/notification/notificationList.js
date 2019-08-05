import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, InteractionManager, ActivityIndicator, Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Api from '../../util/api';
import Notification from './notification';
import Color from "../../style/color";
import {ListEmptyRefreshable} from "../listEmpty";


export default class NotificationList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            refreshing: false,
            error: false
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    refresh(showRefreshing = true) {
        if(showRefreshing) {
            this.setState({refreshing: true});
        }

        (async () => {
            try {
                let notifications = await this.getMessages();
                this.notificationsData = notifications;
                this.setNotifications(notifications);
                this.setState({error: false});
            } catch (e) {
                this.setState({error: true});
            }
            this.setState({refreshing: false});
        })();

        this.props.onRefresh && this.props.onRefresh();
    }

    setNotifications(notifications){
        if(notifications) {
            let reducedNoti = notifications.reduce((ret, v) => {
                if(v.type == 1) {
                    let items = ret.filter(x => x.type === 1 && x.link_id === v.link_id);
                    if(items.length > 0) {
                        items[0].list.push(v);

                    } else {
                        ret.push({
                            type: 1,
                            link_id: v.link_id,
                            created: v.created,
                            list: [v]
                        });
                    }

                } else if (v.type == 2 || v.type == 3) {
                    ret.push(v);
                }

                return ret;

            }, []);

            this.setState({
                notifications: reducedNoti
            });

            this.props.onRefreshed && this.props.onRefreshed(notifications.length);
        }
    }

    getMessages() {
        if(this.props.isHistory) {
            return Api.getMessagesHistory();
        } else {
            return Api.getMessages();
        }
    }

    async _setRead(msg) {
        let ids = null;
        if (msg.type === 1) {    //回复
            ids = msg.list.map(it => it.id);
        } else if (msg.type === 2) {     //关注
            ids = [msg.id];
        } else if(msg.type === 3) {
            ids = [msg.id];
        }

        try {
            this.notificationsData = this.notificationsData.filter((msg) => ids.indexOf(msg.id) === -1);
            this.setNotifications(this.notificationsData);
            await Api.deleteMessage(ids);
        } catch (err) {
            console.log(err);
        }
    }

    _onCommentPress(msg) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'DiaryDetail',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    diaryId: msg.link_id,
                    newCommentIds: msg.list.map(it => it.content.comment_id),
                    needScrollToBottom: true
                }
            }
        });

        if(this.props.isSetRead) {
            this._setRead(msg);
        }
    }

    _onFollowPress(msg) {
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
                    user: msg.content.user
                }
            }
        });

        if(this.props.isSetRead) {
            this._setRead(msg);
        }
    }

    _onLikePress(msg) {
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
                    user: msg.content.user
                }
            }
        });

        if(this.props.isSetRead) {
            this._setRead(msg);
        }
    }

    _onDeletePress(msg) {
        if(this.props.isSetRead) {
            this._setRead(msg);
        }
    }

    render() {
        let hasData = this.state.notifications && this.state.notifications.length > 0;
        return hasData ? (
            <FlatList
                data={this.state.notifications}

                keyExtractor={(item, index) => {
                    return item.id ? item.id.toString() : `${index}`
                }}

                renderItem={({item}) => {
                    return (
                        <Notification msg={item}
                                      onCommentPress={this._onCommentPress.bind(this)}
                                      onFollowPress={this._onFollowPress.bind(this)}
                                      onLikePress={this._onLikePress.bind(this)}
                                      onDeletePress={this._onDeletePress.bind(this)}
                                      showDelete={this.props.isSetRead}
                        />
                    );
                }}

                refreshing={this.state.refreshing}
                onRefresh={this.refresh.bind(this)}

            />
        ) : this.renderEmpty();
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
            <ListEmptyRefreshable message={text} onPress={this.refresh.bind(this)}/>
        );
    }
}

// NotificationList.propTypes = {
//     isHistory: PropTypes.boolean,
//     onRefresh: PropTypes.func,
//     isSetRead: PropTypes.boolean
// };
//
// NotificationList.defaultProps = {
//     isHistory: true,
//     isSetRead: false,
// };




