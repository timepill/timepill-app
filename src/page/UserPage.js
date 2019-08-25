import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated, DeviceEventEmitter, Alert} from 'react-native';
import {
  PagerPan,
  TabView,
  TabBar,
  SceneMap
} from 'react-native-tab-view';
import {Navigation} from 'react-native-navigation';

import Api from '../util/api';
import {Icon} from '../style/icon';
import Event from "../util/event";
import Color from '../style/color';

import UserIntro from '../component/userIntro';
import UserDiaryData from '../dataLoader/userDiaryData';
import DiaryList from '../component/diary/diaryList';
import NotebookList from '../component/notebook/notebookList';


export default class UserPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.user = props.user;
        this.userId = this.user ? this.user.id : (props.userId || 0);
        this.dataSource = new UserDiaryData(this.userId);

        this.state = {
            index: this.user ? 0 : 1,
            routes: [
                { key: 'userIntro', title: '简介' },
                { key: 'diary', title: '日记' },
                { key: 'notebook', title: '日记本' }
            ]
        };
    }

    static options(passProps) {
        return passProps.user ? {
            topBar: {
                noBorder: true, // ios
                elevation: 0, // android
                title: {
                    text: passProps.user.name
                },
                rightButtons: [{
                    id: 'followIcon',
                    icon: Icon.navButtonFollow
                }]
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        } : {
            topBar: {
                noBorder: true, // ios
                elevation: 0, // android
                title: {
                    text: '我'
                },
                rightButtons: [{
                    id: 'setting',
                    icon: Icon.navButtonSetting,
                }]
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        }
    }

    navigationButtonPressed({buttonId}) {
        if(buttonId == 'followIcon') {
            Api.addFollow(this.userId)
                .then(() => {
                    Navigation.mergeOptions(this.props.componentId, {
                        topBar: {
                            rightButtons: [{
                                id: 'navButtonFollowSelected',
                                icon: Icon.navButtonFollowSelected
                            }]
                        }
                    });

                    Alert.alert('已关注');
                })
                .catch(e => {
                    Alert.alert('关注失败');
                })

        } else if(buttonId == 'navButtonFollowSelected') {
            Api.deleteFollow(this.userId)
                .then(() => {
                    Navigation.mergeOptions(this.props.componentId, {
                        topBar: {
                            rightButtons: [{
                                id: 'followIcon',
                                icon: Icon.navButtonFollow
                            }]
                        }
                    });

                    Alert.alert('已取消关注');
                })
                .catch(e => {
                    Alert.alert('取消关注失败');
                })

        } else if(buttonId == 'setting') {
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'Setting',
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
    }

    componentDidMount() {
        if(this.userId) {
            Api.getRelation(this.userId)
                .then(re => {
                    this.followed = re;
                    if(this.followed) {
                        Navigation.mergeOptions(this.props.componentId, {
                            topBar: {
                                rightButtons: [{
                                    id: 'navButtonFollowSelected',
                                    icon: Icon.navButtonFollowSelected
                                }]
                            }
                        });
                    }
                });

        }

        this.notebookListener = DeviceEventEmitter.addListener(Event.updateNotebooks, (param) => {
            this.notebookList.refresh();
        });

        this.diaryListener = DeviceEventEmitter.addListener(Event.updateDiarys, (param) => {
            this.diaryList.refresh();
        });

        this.userInfoListener = DeviceEventEmitter.addListener(Event.userInfoUpdated, (param) => {
            this.userIntro.refresh();
        });
    }

    componentWillUnmount() {
        this.notebookListener.remove();
        this.diaryListener.remove();
        this.userInfoListener.remove();
    }

    _renderLabel = props => ({route}) => {
        let routes = props.navigationState.routes;
        let index = props.navigationState.index;

        let color = route.key == routes[index].key ? Color.primary : '#222';
        
        return (
            <Animated.Text
                style={[localStyle.label, {color}]}>
                {route.title}
            </Animated.Text>
        );
    };

    _renderTabBar = props => {
        return (
          <TabBar
            {...props}
            style={localStyle.tabBar}
            indicatorStyle={localStyle.indicator}

            renderLabel={this._renderLabel(props)}
          >
          </TabBar>
        );
    };

    _renderScene = SceneMap({
        userIntro: () => <UserIntro
            ref={(r) => this.userIntro = r}
            user={this.user}
        />,
        diary: () => <DiaryList
            ref={(r) => this.diaryList = r}
            {...this.props}

            dataSource={this.dataSource}
            showField={['subject', 'createdTime']}
            isMine={!this.user}
        />,
        notebook: () => <NotebookList
            ref={(r) => this.notebookList = r}
            {...this.props}

            user={this.user}
        />
    });

    render() {
      return (
          <TabView style={localStyle.container}
              initialLayout={{
                  height: 0,
                  width: Api.DEVICE_WINDOW.width
              }}

              renderPager = {props => <PagerPan {...props} />} /* android */

              renderTabBar={this._renderTabBar}
              renderScene={this._renderScene}

              navigationState={this.state}
              onIndexChange={index => {
                  this.setState({index});
              }}
              
          />
      );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1
        , backgroundColor: 'white'
    },
    tabBar: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 5
    },
    indicator: {
        backgroundColor: Color.primary
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold'
    }
});
