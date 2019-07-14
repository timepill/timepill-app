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
                    })
                    .done();

                } else {
                    DeviceEventEmitter.emit(Event.updateDiarys);
                }
            })
            .catch(e => {
                Msg.showMsg('操作失败');
            })
            .done();
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
        flexDirection: 'row'
    },
    icon: {
        width: 18,
        height: 18,
        marginLeft: 4,
        marginRight: 1
    },
    text: {
        fontSize: 15
    }
});
