import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, InteractionManager} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Api from '../../util/api';
import Notification from './notification';


export default class NotificationList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            refreshing: false
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    refresh() {
        this.setState({refreshing: true});
        Api.getMessagesHistory()
            .then(notifications => {
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

                                        } else if (v.type == 2) {
                                            ret.push(v);
                                        }
                                        
                                        return ret;

                                      }, []);
                
                    console.log('notifications:', reducedNoti);

                    this.setState({
                        notifications: reducedNoti
                    });
                }

            }).done(() => {
                this.setState({refreshing: false});
            });
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
                    editable: true
                }
            }
        });
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
                        ></Notification>
                    );
                }}

                refreshing={this.state.refreshing}
                onRefresh={this.refresh.bind(this)}

            />
        ) : null;
    }
}

const localStyle = StyleSheet.create({

});



