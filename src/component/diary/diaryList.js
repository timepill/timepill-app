import React, {Component} from 'react';
import {
    InteractionManager,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    Text, View
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Divider} from "react-native-elements";

import Color from '../../style/color';
import Msg from '../../util/msg';
import Api from '../../util/api';

import Touchable from '../touchable';
import ListFooter from '../listFooter';
import DiaryBrief from './diaryBrief';


export default class DiaryList extends Component {

    constructor(props) {
        super(props);

        this.dataSource = props.dataSource;
        this.state = {
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
                    diary: diary
                }
            }
        });
    }

    async refresh() {
        if (this.state.refreshing) {
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
                        let diaries = this.state.diaries;
                        let newDiaries = result.list;
                        if (diaries.length > 0 && newDiaries.length > 0
                                && diaries[0].id === newDiaries[0].id) {

                            Msg.showMsg('没有新内容');
                        }

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
        return (
            <View style={localStyle.container}>
                <FlatList style={localStyle.list}

                    data={this.state.diaries}

                    keyExtractor={(item, index) => {
                        return item.id.toString()
                    }}

                    renderItem={({item}) => {
                        return (
                            <Touchable onPress={() => this._onDiaryPress(item)}>
                                <DiaryBrief diary={item}
                                    showField={this.props.showField}
                                    onUserIconPress={() => this._onUserIconPress(item)}>
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
                            return ListFooter.renderFooterFailed(this.loadMore.bind(this));
                        }

                        if (!this.state.hasMore) {
                            return ListFooter.renderFooterEnd();
                        }

                        return ListFooter.renderFooterLoading();
                    }}

                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh.bind(this)}
                    
                    onEndReachedThreshold={2}
                    onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
                >
                </FlatList>
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