import React, {Component} from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {Icon} from '../style/icon'
import Event from '../util/event'

import DiaryList from '../component/diary/diaryList'
import TopicDiaryData from '../dataLoader/TopicDiaryData';
import Color from "../style/color";


export default class TopicPage extends Component {

    constructor(props) {
        super(props);

        Navigation.events().bindComponent(this);
        this.dataSource = new TopicDiaryData();
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                    text: passProps.title
              },
              rightButtons: [{
                    id: 'write',
                    icon: Icon.navButtonWrite,
              }]
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Write',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    topic: this.props.topic
                }
            }
        });
    }

    componentDidMount() {
        this.diaryListener = DeviceEventEmitter.addListener(Event.updateDiarys, (param) => {
            this.diaryList.refresh();
        });
    }

    componentWillUnmount() {
        this.diaryListener.remove();
    }

    render() {
        return (
          <View style={localStyle.wrap}>
                <DiaryList ref={(r) => this.diaryList = r}
                    dataSource={this.dataSource}
                    {...this.props}
                ></DiaryList>
          </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
