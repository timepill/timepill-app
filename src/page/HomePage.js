import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    InteractionManager, Platform, StyleSheet, Text, TouchableOpacity, View,
    Alert,
    Dimensions
} from 'react-native';
import {Divider} from "react-native-elements";
import {isIphoneX} from 'react-native-iphone-x-helper'

import Color from '../style/color'
import Msg from '../util/msg'

import Loading from '../component/loading'
import Touchable from '../component/touchable'
import DiaryBrief from '../component/diary/diaryBrief'
import DiaryFull from '../component/diary/diaryFull'
import HomeListData from '../entity/homeListData';


const isIpx = isIphoneX();
const isAndroid = Platform.OS === 'android';
const HEADER_PADDING = Platform.OS === 'android' ? 20 : (isIpx ? 10 : 25);
const { width, height } = Dimensions.get('window')

export default class HomePage extends Component {

    constructor(props) {
        super(props);

        this.dataSource = new HomeListData();
        this.state = {
            isLoading: true,

            diaries: [],
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

    async refresh(loadMore = false) {
        if (this.state.refreshing) {
            return;
        }

        this.setState({refreshing: true, hasMore: false, refreshFailed: false});
        this.dataSource.refresh(loadMore)
                .then(data => {
                    console.log('homepage data:', data);
                    if(!data) {
                        throw {
                            message: 'empty data'
                        }

                    } else {
                        let diaries = this.state.diaries;
                        let newDiaries = data.list;
                        if (!loadMore && diaries.length > 0 && newDiaries.length > 0
                                && diaries[0].id === newDiaries[0].id) {

                            Msg.showMsg('没有新内容');
                        }

                        this.setState({
                            diaries: data.list ? data.list : [],
                            hasMore: data.more,
                            refreshFailed: false
                        });
                    }

                }).catch(e => {
                    if (e.code && e.code === 401) {
                        this.props.navigator.showModal({
                            screen: "App"
                        });
                    }

                    this.setState({
                        diaries: [],
                        hasMore: false,
                        refreshFailed: true
                    });

                }).done(() => {
                    this.setState({
                        isLoading: false,
                        refreshing: false
                    });
                });
    }

    async loadMore() {
        if (this.state.refreshing) {
            return;
        }

        this.refresh(true);
    }

    _checkResult(result) {

    }

    _onDiaryPress(diary) {
        /*
        this.props.navigator.push({
            screen: 'DiaryDetail',
            title: '日记详情',
            passProps: { diary: diary }
        });
        */
    }

    render() {
        return (
          <View style={localStyle.wrap}>
            <Loading visible={this.state.isLoading}></Loading>

            <FlatList style={localStyle.list}

                data={this.state.diaries}

                keyExtractor={(item, index) => {
                    return item.id.toString()
                }}

                renderItem={({item}) => {
                    return (
                        <Touchable onPress={() => this._onDiaryPress(item)}>
                            <DiaryBrief diary={item}></DiaryBrief>
                        </Touchable>
                    )
                }}

                ItemSeparatorComponent={({highlighted}) => <Divider style={{backgroundColor: '#eee'}}/>}
                
                ListFooterComponent={this.renderFooter()}

                refreshing={this.state.refreshing}
                onRefresh={this.refresh.bind(this)}
                
                automaticallyAdjustContentInsets={true}
                onEndReachedThreshold={2}
                onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
            />
          </View>
        );
    }

    renderFooter() {
        if (this.state.refreshing || this.state.diaries.length === 0) {
            return null;
        }

        if (this.state.refreshFailed) {
            return (
                <View style={localStyle.footer}>
                    <TouchableOpacity style={{marginTop: 15}}
                                      onPress={() => {this.loadMore();}}>
                        <Text style={{color: Color.primary}}>加载失败,请点击重试</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!this.state.hasMore) {
            return (
                <View style={localStyle.footer}>
                    <Text style={{color: Color.inactiveText, fontSize: 12}}>——  THE END  ——</Text>
                </View>
            );
        }

        return (
            <View style={localStyle.footer}>
                <ActivityIndicator animating={true} color={Color.primary}
                    size={Platform.OS === 'android' ? 'large' : 'small'}/>
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        position: 'absolute',
        backgroundColor: '#fff',
        flex: 1,
        top: 0,
        bottom: 0,
        paddingTop: isIpx || isAndroid ? 44 : 20
    },
    list: {
        backgroundColor: 'white',
        height: '100%'
    },
    footer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15
    }
});
