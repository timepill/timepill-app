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

        this.isMine = props.isMine || false;
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

    scrollToTop() {
        if(!this.scrollY) {
            this.scrollY = 0;
        }
        
        if(this.scrollY <= 10) {
            this.refresh();
            return;
        }

        this.list.scrollToOffset({
            offset: 0
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

    _onDiaryPress(index, diary) {
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

                    showField: this.props.showField,
                    refreshBack: this.refreshOne.bind(this, index)
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

    refreshOne(index, diary) {
        if(diary) {
            let list = this.state.diaries;
            diary.user = list[index].user;
            list[index] = diary;

            this.setState({
                diaries: list
            });
        }
    }

    async refresh() {
        if(this.state.refreshing) {
            return;
        }

        if(this.props.refreshHeader) {
            this.props.refreshHeader();
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

                }).finally(() => {
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

                }).finally(() => {
                    this.setState({
                        loadingMore: false
                    });
                });
    }

    render() {
        if(!this.state.mounting && (!this.state.diaries || this.state.diaries.length == 0)) {
            let message = this.isMine
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
                <FlatList ref={(r) => this.list = r} style={localStyle.list}

                    data={this.state.diaries}

                    keyExtractor={(item, index) => {
                        return item.id + item.updated + item.comment_count + item.like_count;
                    }}

                    renderItem={({item, index}) => {
                        return (
                            <DiaryBrief {...this.props}
                                diary={item}
                                showField={this.props.showField}

                                onDiaryPress={this._onDiaryPress.bind(this, index)}
                                onUserIconPress={() => this._onUserIconPress(item)}
                                onPhotoPress={() => this._onPhotoPress(item.photoUrl)}

                                refreshBack={this.refreshOne.bind(this, index)}
                            >
                            </DiaryBrief>
                        )
                    }}

                    ItemSeparatorComponent={({highlighted}) => <Divider style={{backgroundColor: '#eee', height: StyleSheet.hairlineWidth}}/>}
                    
                    ListHeaderComponent={this.props.listHeader}

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

                    onScroll={(event) => {
                        this.scrollY = event.nativeEvent.contentOffset.y;
                    }}
                >
                </FlatList>
                
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1
        , backgroundColor: 'white'
    },
    list: {
        height: '100%'
    }
});