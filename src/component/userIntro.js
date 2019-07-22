import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, InteractionManager} from 'react-native';
import {Avatar} from "react-native-elements";
import moment from 'moment';

import Color from '../style/color';
import Api from '../util/api';
import Msg from '../util/msg';

import UserIcon from './userIcon'
import Loading from './loading'


export default class UserIntro extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: props.user,
            isLoading: true
        };
    }

    componentDidMount() {
        Api.getSelfInfoByStore()
            .then(user => {
                this.selfInfo = user;

                InteractionManager.runAfterInteractions(() => {
                    this.refresh();
                });
            });
    }

    refresh() {
        let userId = this.state.user ? this.state.user.id : this.selfInfo.id;
        Api.getUserInfo(userId)
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

    render() {
        if(this.state.isLoading) {
            return <Loading visible={this.state.isLoading}></Loading>;
        }

        const user = this.state.user;
        return user ? (
            <ScrollView style={localStyle.container} automaticallyAdjustContentInsets={false}>
                <View style={localStyle.userIcon}>
                    <UserIcon width={90} height={90} iconUrl={user.coverUrl} />
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
        height: 230,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userTitle: {
        fontSize: 22,
        marginTop: 30,
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
