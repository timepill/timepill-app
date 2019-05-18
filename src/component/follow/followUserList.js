import React, {Component} from 'react';
import {StyleSheet, Text, View, InteractionManager, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Touchable from '../touchable';
import Color from '../../style/color';

import UserIcon from '../userIcon';


export default class FollowUserList extends Component {

    constructor(props) {
        super(props);

        this.dataSource = props.dataSource;
        this.listType = props.listType || 'undefined';

        this.state = {
            users: [],
            hasMore: false,

            refreshing: false,
            refreshFailed: false
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    refresh(loadMore = false) {
        if (this.state.refreshing) {
            return;
        }

        this.setState({hasMore: false, refreshing: true, refreshFailed: false});
        this.dataSource.refresh(loadMore)
                .then(result => {
                    if(!result) {
                        throw {
                            message: 'refresh ' + this.listType + ' no result'
                        }

                    } else {
                        console.log('refresh ' + this.listType + ' result:', result);

                        this.setState({
                            users: result.list ? result.list : [],
                            hasMore: result.more,
                            refreshFailed: false
                        });
                    }

                }).catch(e => {
                    this.setState({
                        users: [],
                        hasMore: false,
                        refreshFailed: true
                    });

                }).done(() => {
                    this.setState({
                        refreshing: false
                    });
                });
    }

    loadMore() {
        if (this.state.refreshing) {
            return;
        }

        this.refresh(true);
    }

    render() {
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
                                <UserIcon iconUrl={item.iconUrl}></UserIcon>
                                <Text style={localStyle.userName}>{item.name}</Text>
                                <Touchable onPress={() => {}}>
                                    <Ionicons name="md-close" size={20}
                                        style={localStyle.removeIcon}
                                        color={Color.inactiveText} />
                                </Touchable>
                            </View>
                          </Touchable>
                        );
                    }}

                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh.bind(this)}

                    onEndReachedThreshold={5}
                    onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
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
