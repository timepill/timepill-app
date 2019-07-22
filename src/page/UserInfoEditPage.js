import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    Keyboard
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Color from '../style/color';
import Token from '../util/token'
import Api from '../util/api';
import Event from '../util/event';
import Msg from '../util/msg';

import Loading from '../component/loading'
import ImageAction from '../component/image/imageAction'


export default class UserInfoEditPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            uploading: false
        };
    }

    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: '修改个人信息'
                }
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    componentDidMount() {
        this.loadUser();
        this.userInfoListener = DeviceEventEmitter.addListener(Event.userInfoUpdated, this.loadUser.bind(this));
    }

    componentWillUnmount() {
        this.userInfoListener.remove();
    }

    loadUser() {
        Api.getSelfInfoByStore()
            .then(user => {
                this.setState({user});
            });
    }

    editIcon() {
        ImageAction.action({
            width: 640,
            height: 640,
            cropping: true

        }, -1, 640 * 640, (e, imageUri) => {
            
            if(e) {
                Msg.showMsg('操作失败：' + e.message);
            } else {
                this.uploadIcon(imageUri);
            }
        });
    }

    uploadIcon(uri) {
        this.setState({uploading: true});
        Api.updateUserIcon(uri)
            .then(async user => {
                await Token.setUserInfo(user);
                this.loadUser();

                Msg.showMsg('头像保存成功');
                DeviceEventEmitter.emit(Event.userInfoUpdated);
                
            })
            .catch(e => {
                Msg.showMsg('头像更新失败:' + e.message);
            })
            .finally(() => {
                this.setState({uploading: false});
            });
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
                },
                passProps: {
                    user: this.state.user
                }
            }
        });
        
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
                <Loading visible={this.state.uploading}></Loading>
                {
                    this.state.user ? (
                        <View style={localStyle.group}>
                            <TouchableOpacity style={localStyle.item} onPress={this.editIcon.bind(this)}>
                                <Text style={localStyle.title}>头像</Text>
                                <View style={localStyle.right}>
                                    <Image source={{uri: this.state.user.iconUrl}} style={{width: 28, height: 28, borderRadius: 14}} />
                                    <Ionicons name="ios-arrow-forward" style={localStyle.arrow} size={18}/>
                                </View>
                            </TouchableOpacity>
                            <View style={localStyle.line} />

                            <TouchableOpacity style={localStyle.item} onPress={() => this.jumpTo('UserNameEdit')}>
                                <Text style={localStyle.title}>名字</Text>
                                <View style={localStyle.right}>
                                    <Text style={localStyle.value}>{this.state.user.name}</Text>
                                    <Ionicons name="ios-arrow-forward" style={localStyle.arrow} size={18}/>
                                </View>
                            </TouchableOpacity>
                            <View style={localStyle.line} />

                            <TouchableOpacity style={localStyle.item} onPress={() => this.jumpTo('UserIntroEdit')}>
                                <Text style={localStyle.title}>个人简介</Text>
                                <Ionicons name="ios-arrow-forward" style={localStyle.arrow} size={18}/>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
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
        color: '#222'
    },
    line: {
        marginLeft: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    right: {
        flexDirection:'row',
        alignItems: 'center'
    },
    arrow: {
        paddingTop: 1,
        color: Color.inactiveText,
        paddingLeft: 15
    },
    value: {
        fontSize: 16,
        color: Color.inactiveText
    },
    button: {
        flex: 1,
        textAlign: 'center',
        color: '#d9534f',
        fontSize: 16
    }
});

