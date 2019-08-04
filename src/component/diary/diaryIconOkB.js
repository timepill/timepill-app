import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';

import Color from '../../style/color';
import Api from '../../util/api';
import Msg from '../../util/msg';
import Event from '../../util/event';


export default class DiaryIconOkB extends Component {

    constructor(props) {
        super(props);

        this.state = {
            diaryId: props.diaryId || null,
            count: props.count || 0,
            active: props.active || false,
            clickable: props.clickable && true
        }

        this.refreshBack = props.refreshBack || null;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            diaryId: nextProps.diaryId || null,
            count: nextProps.count || 0,
            active: nextProps.active || false,
            clickable: nextProps.clickable && true
        });

        this.refreshBack = nextProps.refreshBack || null;
    }

    onPress() {
        if(!this.state.clickable) {
            return;
        }

        let count = this.state.count;
        let isActive = this.state.active;

        (!isActive ? Api.likeDiary(this.state.diaryId) : Api.cancelLikeDiary(this.state.diaryId))
            .then(re => {
                if(this.refreshBack) {
                    Api.getDiary(this.state.diaryId)
                    .then(result => {
                        if(result) {
                            this.refreshBack(result);
                        }
                    }).catch((err) => console.log(err))

                } else {
                    DeviceEventEmitter.emit(Event.updateDiarys);
                }
            })
            .catch(e => {
                Msg.showMsg('操作失败');
            })
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

                    {
                        this.state.count > 0 ?
                        <Text style={[localStyle.text, {
                                color: !this.state.active
                                ? Color.inactiveText
                                : Color.primary
                            }]}
                        >{this.state.count}</Text>
                        : null
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        marginRight: 10,
        marginTop: -1
    },
    icon: {
        width: 16,
        height: 16,
        marginLeft: 4,
        marginTop: 2,
        marginBottom: 2,
    },
    text: {
        fontSize: 15,
        marginLeft: 4
    }
});
