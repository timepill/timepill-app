import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Switch,
    Alert,
    Linking,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Api from '../util/api';
import Token from '../util/token';
import Color from '../style/color';


export default class SettingPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hasPassword: false,
            hasUpdateNews: false,

            settings: {}
        }
    }

    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: '设置'
                }
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    componentDidMount() {
        this.refreshPasswordState();
        this.passwordListener = DeviceEventEmitter.addListener('passwordUpdated', this.refreshPasswordState.bind(this));
    }

    componentWillUnmount() {
        this.passwordListener.remove();
    }

    refreshPasswordState() {
        Token.getLoginPassword()
            .then((pwd) => this.setState({
                hasPassword: pwd != null && pwd.length > 0
            }));
    };

    changePassword = () => {
        let titleText = '';
        if(!this.state.hasPassword) {
            titleText = '设置启动密码';
        } else {
            titleText = '取消启动密码';
        }

        Navigation.push(this.props.componentId, {
            component: {
                name: 'Password',
                options: {
                    topBar: {
                        title: {
                            text: titleText
                        }
                    },
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    type: 'setting',
                    operation: !this.state.hasPassword ? 'setnew' : 'cancel'
                }
            }
        });
    };

    changePush = (val) => {
        // 
    }

    jumpTo(pageName) {
        Navigation.push(this.props.componentId, {
            component: {
                name: pageName,
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

    logout() {
        Alert.alert('提示','确认退出登录?',[
            {text: '退出', style: 'destructive', onPress: () => {
                Api.logout();

                /*
                *  clear ActionSheet instance
                */
                if(global.__action_sheet) {
                    global.__action_sheet = null;
                }

                Navigation.setRoot({
                    root: {
                        stack: {
                            children: [{
                                component: {
                                    name: 'Timepill',
                                    options: {
                                        topBar: {
                                            visible: false,

                                            // hide top bar for android
                                            drawBehind: true,
                                            animate: true
                                        }
                                    }
                                }
                            }]
                        }
                    }
                });
            }},
            {text: '取消', onPress: () => {}}
        ]);
    }

    render() {
        return (
            <View style={localStyle.wrap}>
                <View style={localStyle.group}>
                    <TouchableOpacity style={localStyle.item} onPress={() => this.jumpTo('UserInfoEdit')}>
                        <Text style={localStyle.title}>修改个人信息</Text>
                        <Ionicons name="ios-arrow-forward" style={localStyle.arrow} size={18} color='#0076FF'/>
                    </TouchableOpacity>
                    <View style={localStyle.line} />

                    <View style={localStyle.item}>
                        <Text style={localStyle.title}>启动密码</Text>
                        <Switch value={this.state.hasPassword}
                                trackColor={Api.IS_ANDROID ? Color.textSelect : null}
                                thumbColor={Api.IS_ANDROID && this.state.hasPassword ? Color.light : null}
                                onValueChange={this.changePassword} />
                    </View>
                    {/*<View style={localStyle.line} />*/}

                    {/*<View style={localStyle.item}>*/}
                    {/*    <Text style={localStyle.title}>提醒推送</Text>*/}
                    {/*    <Switch value={this.state.settings['pushMessage']}*/}
                    {/*            trackColor={Api.IS_ANDROID ? Color.textSelect : null}*/}
                    {/*            thumbColor={Api.IS_ANDROID && this.state.settings['pushMessage'] ? Color.light : null}*/}
                    {/*            onValueChange={this.changePush} />*/}
                    {/*</View>*/}
                </View>

                <View style={localStyle.group}>
                    {
                        Api.IS_IOS ? (
                            <View>
                                <TouchableOpacity style={localStyle.item}
                                    onPress={() =>
                                        Linking.openURL("https://itunes.apple.com/us/app/jiao-nang-ri-ji/id1142102323?l=zh&ls=1&mt=8")}
                                >
                                    <Text style={localStyle.title}>去 App Store 评价</Text>
                                    <Ionicons name="ios-arrow-forward" style={localStyle.arrow} size={18}/>
                                </TouchableOpacity>
                                <View style={localStyle.line} />
                            </View>
                        ) : null
                    }

                    <TouchableOpacity style={localStyle.item}
                        onPress={() => this.jumpTo('Feedback')}>
                        <Text style={localStyle.title}>意见反馈</Text>
                        <Ionicons name="ios-arrow-forward" style={localStyle.arrow} size={18}/>
                    </TouchableOpacity>
                    <View style={localStyle.line} />

                    <TouchableOpacity style={localStyle.item}
                        onPress={() => this.jumpTo('About')}>
                        <Text style={localStyle.title}>关于</Text>
                        {
                            this.state.hasUpdateNews
                            ? (
                            <View style={localStyle.badge}>
                                <Text style={localStyle.badgeText}>1</Text>
                            </View>
                            )
                            : null
                        }
                        <Ionicons name="ios-arrow-forward" style={localStyle.arrow} size={18}/>
                    </TouchableOpacity>
                </View>

                <View style={[localStyle.group, { marginTop: 45 }]}>
                    <TouchableOpacity style={localStyle.item}
                        onPress={this.logout.bind(this)}
                    >
                        <Text style={localStyle.button}>退出登录</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#EFEFF4'
    },
    group: {
        marginTop: 30,
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 45
    },
    title: {
        fontSize: 16,
        color: '#222',
        flex: 1
    },
    line: {
        marginLeft: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    arrow: {
        paddingTop: 1,
        color: Color.inactiveText
    },
    button: {
        flex: 1,
        textAlign: 'center',
        color: '#d9534f',
        fontSize: 16
    },
    badge: {
        backgroundColor: 'red',
        paddingHorizontal:8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 10
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Arial'
    }
});