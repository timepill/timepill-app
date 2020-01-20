import React, {Component} from 'react';
import {StyleSheet, Text, View, InteractionManager, FlatList, Alert} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Touchable from '../touchable';
import Color from '../../style/color';
import Api from '../../util/api';

import UserIcon from '../userIcon';
import Loading from '../loading';
import {ListFooterEnd} from '../listFooter';


export default class BlockUserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isLoading: true
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    _onDeletePress(user) {
        Alert.alert('提示', '确定解除屏蔽?', [
            {text: '确定', style: 'destructive', onPress: () => {
                Api.deleteUserBlock(user.id)
                    .then(() => {
                        let filterUsers = this.state.users.filter((it) => it.id !== user.id);
                        this.setState({
                            users: filterUsers
                        });
                    })
                    .catch(e => {
                        Alert.alert('解除屏蔽失败');
                    });
            }},
            {text: '取消', onPress: () => {}}
        ]);
    }

    refresh() {
        Api.getBlockUsers()
            .then(data => {
                if (data) {
                    this.setState({
                        users: data.users || [],
                    });
                }
            })
            .catch(e => {
                console.log('block user error:', e);
            })
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            });
    }

    render() {
        if (this.state.isLoading) {
            return <Loading visible={this.state.isLoading}></Loading>;
        }

        return (
            <View style={localStyle.container}>
                <FlatList style={localStyle.list}

                    data={this.state.users}

                    keyExtractor={(item, index) => {
                        return item.id ? item.id.toString() : index;
                    }}

                    renderItem={({item}) => {
                        return (
                          <Touchable key={item.id} onPress={() => {}}>
                            <View style={localStyle.box}>
                                <UserIcon iconUrl={item.iconUrl} onPress={() => {}}></UserIcon>
                                <Text style={localStyle.userName}>{item.name}</Text>
                                <Touchable onPress={() => this._onDeletePress(item)}>
                                    <Ionicons name="md-close" size={20}
                                        style={localStyle.removeIcon}
                                        color={Color.inactiveText}
                                    />
                                </Touchable>
                            </View>
                          </Touchable>
                        );
                    }}

                    ListFooterComponent={() => <ListFooterEnd></ListFooterEnd>}
                />
            </View>
        );
    }
}


const localStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        height: '100%'
    },
    box: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Color.line,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 25
    },
    userName: {
        flex: 1,
        color: Color.text,
        fontSize: 16
    },
    removeIcon: {
        padding: 20
    }
});
