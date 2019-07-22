import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    SectionList,
    InteractionManager,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import moment from 'moment';

import Api from '../../util/api';
import Color from '../../style/color';
import Touchable from '../touchable';
import Loading from '../loading';

import DiaryBrief from '../diary/diaryBrief';
import {ListEmptyRefreshable} from '../listEmpty';
import NotebookDiaryData from '../../dataLoader/notebookDiaryData';
import {
    ListFooterLoading,
    ListFooterEnd,
    ListFooterFailed
} from '../listFooter';


export default class NotebookDiaryList extends Component {

    constructor(props) {
        super(props);

        this.notebook =  props.notebook;
        this.isMine = props.isMine || false;
        this.dataSource = new NotebookDiaryData();

        this.state = {
            mounting: true,

            rawlist: [],
            diaries: [],

            refreshing: false,
            refreshFailed: false,

            hasMore: true,
            loadingMore: false,
            loadFailed: false
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    formatDiaries(diaries) {
        let today = moment().format('YYYY年M月D日');
        let reducedDiaries = diaries.reduce((maplist, item) => {
            let [year, month, day] =
                item.created.substr(0, 10).split('-')
                .map(it => Number(it));

            let date = `${year}年${month}月${day}日`;
            if(date === today) {
                date = '今天';
            }

            if(!maplist[date]) {
                maplist[date] = [];
            }

            maplist[date].push(item);
            
            return maplist;

        }, {});

        let result = [];
        for(let key in reducedDiaries) {
            result.push({
                title: key,
                data: reducedDiaries[key]
            });
        }

        return result;
    }

    refreshOne(index, diary) {
        if(diary) {
            let list = this.state.rawlist;
            diary.user = list[index].user;

            list[index] = diary;

            this.setState({
                diaries: this.formatDiaries(list)
            });
        }
    }

    refresh() {
        if (this.state.refreshing) {
            return;
        }

        this.setState({refreshing: true, refreshFailed: false});
        this.dataSource.refresh(this.notebook.id)
                .then(result => {
                    if(!result) {
                        throw {
                            message: 'refresh notebookDiary no result'
                        }

                    } else {
                        let diaries = this.formatDiaries(result.list);
                        this.setState({
                            rawlist: result.list,
                            
                            diaries,
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

    loadMore() {
        if (this.state.loadingMore) {
            return;
        }

        this.setState({loadingMore: true, loadFailed: false});
        this.dataSource.refresh(this.notebook.id, true)
                .then(result => {
                    if(!result) {
                        throw {
                            message: 'loadMore notebookDiary no result'
                        }

                    } else {
                        let diaries = this.formatDiaries(result.list);
                        this.setState({
                            rawlist: result.list,

                            diaries,
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
                    showField: ['createdTime'],

                    expired: this.notebook.isExpired
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

    render() {
        if(!this.notebook) {
            return null;
        }

        if(this.state.refreshing) {
            return (<Loading visible={true} color={Color.primary}></Loading>);
        }

        if(!this.state.mounting && (!this.state.diaries || this.state.diaries.length == 0)) {
            return (
                <ListEmptyRefreshable
                    error={this.state.refreshFailed}
                    message={'没有日记'}
                    onPress={this.refresh.bind(this)}

                ></ListEmptyRefreshable>
            );
        }

        let expired = this.notebook.isExpired;
        let isMine = this.isMine;

        return (
          <View style={localStyle.container}>
            <SectionList
                
                keyExtractor={(item, index) => {
                    return item.id + item.updated + item.comment_count + item.like_count;
                }}

                sections={this.state.diaries}

                renderItem={(rowData) => {
                    return (
                        <DiaryBrief {...this.props}
                            diary={rowData.item}
                            showField={['createdTime']}
                            expired={expired}
                            isMine={isMine}
                            
                            onDiaryPress={this._onDiaryPress.bind(this, rowData.index)}
                            onPhotoPress={() => this._onPhotoPress(rowData.item.photoUrl)}

                            refreshBack={this.refreshOne.bind(this, rowData.index)}
                        >
                        </DiaryBrief>
                    );
                }}

                renderSectionHeader={(info) => {
                    return (<View style={localStyle.sectionHeader}>
                        <Text>{info.section.title}</Text>
                    </View>);
                }}

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

                ItemSeparatorComponent={(sectionID, rowID, adjacentRowHighlighted) =>
                    <View key={`${sectionID}-${rowID}`} style={localStyle.itemSeparator} />}
                
                SectionSeparatorComponent={() => <View style={localStyle.sectionSeparator} />}

                onEndReachedThreshold={2}
                onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
            />
          </View>

        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    sectionHeader: {
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 15,
        paddingVertical: 8,
        color: Color.text
    },
    itemSeparator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Color.line
    },
    sectionSeparator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Color.line
    }
});