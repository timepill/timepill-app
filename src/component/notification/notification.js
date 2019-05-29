import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Touchable from '../touchable';
import Color from '../../style/color'


function unique(array) {
    let n = [];
    for(let i=0; i<array.length; i++) {
        if(n.indexOf(array[i]) == -1) {
            n.push(array[i])
        };
    }
    
    return n;
}

export default class Notification extends Component {

    render() {
        let msg = this.props.msg;
        if(msg && msg.type) {
            if(msg.type == 1) {
                return this.renderComment(msg);

            } else if(msg.type == 2) {
                return this.renderFollow(msg);
            }
        }

        return null;
    }

    renderComment(msg) {
        const users = unique(msg.list.map(it => it.content.author.name)).join('、');
        const body = `${users} 回复了你`;

        return (
            <Touchable key={msg.link_id} onPress={() => this.props.onCommentPress(msg)}>
                <View style={localStyle.container}>
                    <Ionicons name="ios-text" size={16} style={localStyle.icon} color={Color.light} />
                    <Text style={localStyle.text}>{body}</Text>
                </View>
            </Touchable>
        )
    }

    renderFollow(msg) {
        const body = `${msg.content.user.name} 关注了你`;

        return (
            <Touchable key={msg.link_id} onPress={() => this.props.onFollowPress(msg)}>
                <View style={localStyle.container}>
                    <Ionicons name="ios-heart" size={16} style={localStyle.icon} color='#d9534f' />
                    <Text key={msg.link_id} style={localStyle.text}>{body}</Text>
                </View>
            </Touchable>
        )
    }
}

const localStyle = StyleSheet.create({
    container: {
        padding: 20,
        borderColor: Color.line,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row'
    },
    icon: {
        marginRight: 10,
        marginTop: 1,
        lineHeight: 20
    },
    text: {
        flex: 1,
        lineHeight: 20
    }
});