import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color'
import Api from '../util/api';

import DiaryList from '../component/diary/diaryList'
import HomeDiaryData from '../dataLoader/homeDiaryData';


export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.dataSource = new HomeDiaryData();

        this.state = {
            topic: null
        }
    }

    refreshTopic() {
        Api.getTodayTopic()
            .then(topic => {
                if(topic) {
                    this.setState({topic});
                }
            })
            .done();
    }

    openTopicPage() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Topic',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    topic: this.state.topic,
                    title: '话题：' + this.state.topic.title
                }
            }
        });
    }

    render() {
        return (
          <View style={localStyle.wrap}>
                <DiaryList ref={(r) => this.list = r}
                    dataSource={this.dataSource}
                    listHeader={this.renderHeader.bind(this)}
                    refreshHeader={this.refreshTopic.bind(this)}
                    {...this.props}
                ></DiaryList>
          </View>
        );
    }

    renderHeader() {
        return this.state.topic ? (
            <View style={localStyle.topic}>
                <TouchableOpacity onPress={this.openTopicPage.bind(this)} activeOpacity={0.7}>
                    <ImageBackground
                        style={localStyle.topicBox} imageStyle={{borderRadius: 8}}
                        source={{uri: this.state.topic.imageUrl}}>
                        <Text style={localStyle.topicTitle} allowFontScaling={false}># {this.state.topic.title}</Text>
                        <Text style={localStyle.topicIntro} allowFontScaling={false}>{this.state.topic.intro}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        ) : null;
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#fff'
    },
    topic: {
        paddingTop: 0
    },
    topicBox: {
        flex: 1,
        height: 240,
        marginTop: 15,
        marginBottom: 15,
        marginHorizontal: 15,
        backgroundColor: Color.spaceBackground,
        borderRadius: 8
    },
    topicTitle: {
        fontSize: 24,
        color: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        shadowOpacity: 0.2
    },
    topicIntro: {
        fontSize: 16,
        color: '#FFF',
        paddingHorizontal: 22,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        shadowOpacity: 0.5
    }
});
