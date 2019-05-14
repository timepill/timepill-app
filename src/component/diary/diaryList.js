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
import DiaryBrief from './diaryBrief';


export default class DiaryList extends Component {

    constructor(props) {
        super(props);

        this.dataSource = props.dataSource;
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

        this.setState({hasMore: false, refreshing: true, refreshFailed: false});
        this.dataSource.refresh(loadMore)
                .then(result => {
                    if(!result) {
                        throw {
                            message: 'refresh no result'
                        }

                    } else {
                        let diaries = this.state.diaries;
                        let newDiaries = result.list;
                        if (!loadMore && diaries.length > 0 && newDiaries.length > 0
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
                    if (e.code === 401) {
                        /*
                        this.props.navigator.showModal({
                            screen: "App"
                        });
                        */
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

    render() {
        return (
            <View style={localStyle.container}>
                <FlatList style={localStyle.list}

                    data={this.state.diaries}

                    keyExtractor={(item, index) => {
                        return item.id.toString()
                    }}

                    ListHeaderComponent={this.state.isLoading ? null : this.props.header}

                    renderItem={({item}) => {
                        return (
                            <Touchable onPress={() => this.props.onDiaryPress(item)}>
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
                >
                </FlatList>
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
                    size={Api.IS_ANDROID ? 'large' : 'small'}/>
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
    footer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15
    }
});