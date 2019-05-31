import React, {Component} from 'react';
import {
    InteractionManager,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    Text,
    View,
    Alert
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Divider} from "react-native-elements";
import ActionSheet from 'react-native-actionsheet-api';

import Color from '../../style/color';
import Msg from '../../util/msg';
import Api from '../../util/api';

import Touchable from '../touchable';
import {
    ListFooterLoading,
    ListFooterEnd,
    ListFooterFailed
} from '../listFooter';
import {ListEmptyRefreshable} from '../listEmpty';
import DiaryBrief from './diaryBrief';


export default class DiaryList extends Component {

    constructor(props) {
        super(props);

        this.editable = props.editable || false;
        this.dataSource = props.dataSource;

        this.state = {
            mounting: true,
            diaries: [],
            
            refreshing: false,
            refreshFailed: false,

            hasMore: true,
            loadingMore: false,
            loadFailed: false
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    _onUserIconPress(diary) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'User',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    user: diary.user
                }
            }
        });
    }

    _onDiaryPress(diary) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'DiaryDetail',
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                },
                passProps: {
                    diary: diary,
                    user: diary.user,

                    editable: this.editable
                }
            }
        });
    }

    _onPhotoPress(photoUrl) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'Photo',
                passProps: {
                    url: photoUrl
                }
            }
        });
    }

    async refresh() {
        if(this.state.refreshing) {
            return;
        }

        this.setState({refreshing: true, refreshFailed: false});
        this.dataSource.refresh()
                .then(result => {
                    if(!result) {
                        throw {
                            message: 'refresh diary no result'
                        }

                    } else {
                        this.setState({
                            diaries: result.list ? result.list : [],
                            hasMore: result.more,
                            refreshFailed: false
                        });
                    }

                }).catch(e => {
                    this.setState({
                        refreshFailed: true
                    });

                }).done(() => {
                    this.setState({
                        mounting: false,
                        refreshing: false
                    });
                });
    }

    async loadMore() {
        if (this.state.loadingMore) {
            return;
        }

        this.setState({loadingMore: true, loadFailed: false});
        this.dataSource.refresh(true)
                .then(result => {
                    if(!result) {
                        throw {
                            message: 'loadMore diary no result'
                        }

                    } else {
                        this.setState({
                            diaries: result.list ? result.list : [],
                            hasMore: result.more,
                            loadFailed: false
                        });
                    }

                }).catch(e => {
                    this.setState({
                        hasMore: false,
                        loadFailed: true
                    });

                }).done(() => {
                    this.setState({
                        loadingMore: false
                    });
                });
    }

    render() {
        if(!this.state.mounting && (!this.state.diaries || this.state.diaries.length == 0)) {
            let message = this.editable
                            ? '今天还没有写日记，马上写一篇吧'
                            : '今天还没有人写日记';
            return (
                <ListEmptyRefreshable
                    error={this.state.refreshFailed}
                    message={message}
                    onPress={this.refresh.bind(this)}

                ></ListEmptyRefreshable>
            );
        }

        return (
            <View style={localStyle.container}>
                <FlatList style={localStyle.list}

                    data={this.state.diaries}

                    keyExtractor={(item, index) => {
                        return item.id + item.updated + item.comment_count;
                    }}

                    renderItem={({item}) => {
                        return (
                            <Touchable onPress={() => this._onDiaryPress(item)}>
                                <DiaryBrief {...this.props}
                                    diary={item}
                                    showField={this.props.showField}
                                    editable={this.editable}

                                    onUserIconPress={() => this._onUserIconPress(item)}
                                    onPhotoPress={() => this._onPhotoPress(item.photoUrl)}
                                >

                                </DiaryBrief>
                            </Touchable>
                        )
                    }}

                    ItemSeparatorComponent={({highlighted}) => <Divider style={{backgroundColor: '#eee'}}/>}
                    
                    ListFooterComponent={() => {
                        if (this.state.refreshing || this.state.loadingMore || this.state.diaries.length == 0) {
                            return null;
                        }

                        if (this.state.loadFailed) {
                            return <ListFooterFailed refresh={this.loadMore.bind(this)}></ListFooterFailed>;
                        }

                        if (!this.state.hasMore) {
                            return <ListFooterEnd></ListFooterEnd>;
                        }

                        return <ListFooterLoading></ListFooterLoading>;
                    }}

                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh.bind(this)}
                    
                    onEndReachedThreshold={2}
                    onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
                >
                </FlatList>
                <ActionSheet/>
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
    }
});