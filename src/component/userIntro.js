import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, InteractionManager, Alert} from 'react-native';
import {Avatar, Button} from "react-native-elements";
import moment from 'moment';

import Color from '../style/color';
import Api from '../util/api';
import Msg from '../util/msg';

import UserIcon from './userIcon';
import Loading from './loading';


export default class UserIntro extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: props.user,
            followed: 0,

            isLoading: true
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    _onAddFollow() {
        Api.addFollow(this.state.user.id)
            .then(() => {
                this.setState({
                    followed: 1
                });

                Alert.alert('已关注');
            })
            .catch(e => {
                Alert.alert('关注失败');
            })
    }

    _onDeleteFollow() {
        Api.deleteFollow(this.state.user.id)
            .then(() => {
                this.setState({
                    followed: -1,
                });

                Alert.alert('已取消关注');
            })
            .catch(e => {
                Alert.alert('取消关注失败');
            })
    }

    refresh(userId) {
        let targetId = userId;
        if(!targetId) {
            targetId = this.state.user ? this.state.user.id : null;
        }

        if(targetId) {
            Api.getUserInfo(targetId)
                .then(user => {
                    this.setState({
                        user: user
                    });
                })
                .catch(e => {
                    Msg.showMsg('用户信息加载失败');
                })
                .finally(() => {
                    this.setState({
                        isLoading: false
                    })
                });
        }
    }

    refreshFollowed(followed = 0) {
        if(followed) {
            this.setState({
                followed: followed
            });
        }
    }

    render() {
        if(this.state.isLoading) {
            return <Loading visible={this.state.isLoading}></Loading>;
        }

        const user = this.state.user;
        const followed = this.state.followed;

        return user ? (
            <ScrollView style={localStyle.container} automaticallyAdjustContentInsets={false}>
                <View style={localStyle.userIcon}>
                    <UserIcon width={90} height={90} iconUrl={user.coverUrl} />

                    {
                        followed < 0
                        ? <Button title="+关注"
                            outline={true}
                            color={Color.primary}
                            borderRadius={5}
                            buttonStyle={localStyle.followButton}
                            fontSize={14}
                            onPress={this._onAddFollow.bind(this)}
                        />
                        : (
                            followed > 0
                            ? <Button title="取消关注"
                                outline={true}
                                color={Color.primary}
                                borderRadius={5}
                                buttonStyle={localStyle.followButton}
                                fontSize={14}
                                onPress={this._onDeleteFollow.bind(this)}
                            />
                            : null
                        )
                    }

                    <Text style={localStyle.userTitle}>{user.name}</Text>
                </View>

                {
                    user.intro && user.intro.length > 0
                    ? (<Text style={localStyle.introText}>{user.intro}</Text>) : null
                }
                
                <Text style={localStyle.joinTime}>
                    {moment(user.created).format('YYYY年M月D日')}加入胶囊
                </Text>

            </ScrollView>
        ) : null;
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    userIcon: {
        marginTop: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followButton: {
        width: 90,
        height: 28,
        marginTop: 20,
        marginRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userTitle: {
        fontSize: 22,
        marginTop: 30,
        marginRight: 3,
        fontWeight: 'bold',
        color: '#000'
    },
    introText: {
        padding: 15,
        color: Color.text,
        lineHeight: 24,
        textAlign: 'center'
    },
    joinTime: {
        marginTop: 30,
        marginBottom:60,
        padding: 15,
        color: Color.inactiveText,
        lineHeight: 20,
        textAlign: 'center'
    }
});
