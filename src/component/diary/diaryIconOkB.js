import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import Color from '../../style/color';
import Api from '../../util/api';
import Msg from '../../util/msg';


export default class DiaryIconOkB extends Component {

    constructor(props) {
        super(props);

        this.state = {
            diaryId: props.diaryId || null,
            count: props.count || 0,
            active: props.active || false,
            clickable: props.clickable && true
        }
    }

    onPress() {
        if(!this.state.clickable) {
            return;
        }

        let count = this.state.count;
        let isActive = this.state.active;

        if(!isActive) {
            Api.likeDiary(this.state.diaryId)
                .then(re => {
                    this.setState({
                        count: count + 1,
                        active: true
                    })
                })
                .catch(e => {
                    Msg.showMsg('操作失败');
                })
                .done();

        } else {
            Api.cancelLikeDiary(this.state.diaryId)
                .then(re => {
                    this.setState({
                        count: count - 1,
                        active: false
                    })
                })
                .catch(e => {
                    Msg.showMsg('操作失败');
                })
                .done();
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onPress.bind(this)}>
                <View style={localStyle.wrap}>
                    <Image
                        source={
                            !this.state.active
                            ? require('../../img/ok-beng1.png')
                            : require('../../img/ok-beng2.png')
                        }
                        style={localStyle.icon}
                    />

                    <Text style={[localStyle.icon, {
                            color: !this.state.active
                            ? Color.inactiveText
                            : Color.primary
                        }]}
                    >{this.state.count}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        marginRight: 6
    },
    icon: {
        width: 18,
        height: 18,
        marginLeft: 2,
        marginRight: 4
    },
    text: {
        fontSize: 15
    }
});
