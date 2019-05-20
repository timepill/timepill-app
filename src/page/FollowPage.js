import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Api from '../util/api'
import {Icon} from '../style/icon'

import DiaryList from '../component/diary/diaryList'
import FollowDiaryData from '../dataLoader/followDiaryData';


export default class FollowPage extends Component {

    constructor(props) {
        super(props);

        Navigation.events().bindComponent(this);
        this.dataSource = new FollowDiaryData();
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '关注'
              },
              rightButtons: [{
                  id: 'followIcon',
                  icon: Icon.followIcon,

                  color: '#aaa' // android
              }]
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        /*
        Navigation.setRoot({
          root: {
            stack: {
              children: [{
                component: {
                  name: 'FollowUser'
                }
              }]
            }
          }
        });
        */

        Navigation.push(this.props.componentId, {
            component: {
                name: 'FollowUser',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                }
            }
        });
        
    }

    _onDiaryPress(diary) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'DiaryDetail',
                passProps: {
                    diary: diary
                }
            }
        });
    }

    renderHeader() {
        return (
            <View style={localStyle.header}>
                <Text style={localStyle.title}>关注</Text>
            </View>
        );
    }

    render() {
        return (
          <View style={localStyle.wrap}>
                <DiaryList ref={(r) => this.list = r}
                    dataSource={this.dataSource}
                    /* header={this.renderHeader.bind(this)} */
                    onDiaryPress={this._onDiaryPress.bind(this)}

                    navigator={this.props.navigator}

                ></DiaryList>
          </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20
    },
    header: {
        paddingLeft: 20,
        flexDirection: "row"
    },
    title: {
        flex: 1,
        fontSize: 30,
        color: '#000'
    }
});
