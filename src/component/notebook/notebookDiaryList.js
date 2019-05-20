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
import moment from 'moment'

import Api from '../../util/api';
import Color from '../../style/color';
import Touchable from '../touchable';

import DiaryBrief from '../diary/diaryBrief';
import ListFooter from '../listFooter';
import NotebookDiaryData from '../../dataLoader/notebookDiaryData';


export default class NotebookDiaryList extends Component {

    constructor(props) {
        super(props);

        this.dataSource = new NotebookDiaryData();
        this.notebook =  props.notebook;

        this.state = {
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
        console.log('reduce result:', reducedDiaries);

        let result = [];
        for(let key in reducedDiaries) {
            result.push({
                title: key,
                data: reducedDiaries[key]
            });
        }

        console.log('format result:', result);
        return result;
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
                            diaries,
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

                }).done(() => {
                    this.setState({
                        loadingMore: false
                    });
                });
    }

    render() {
        return this.notebook ? (
          <View style={localStyle.container}>
            <SectionList
                
                keyExtractor={(item, index) => item.id}

                sections={this.state.diaries}

                renderItem={(rowData) => {
                    return (<Touchable onPress={() => {}}>
                        <DiaryBrief diary={rowData.item}
                            showField={['createdTime']}>
                        </DiaryBrief>
                    </Touchable>);
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
                        return ListFooter.renderFooterFailed(this.loadMore.bind(this));
                    }

                    if (!this.state.hasMore) {
                        return ListFooter.renderFooterEnd();
                    }

                    return ListFooter.renderFooterLoading();
                }}

                ItemSeparatorComponent={(sectionID, rowID, adjacentRowHighlighted) =>
                    <View key={`${sectionID}-${rowID}`} style={localStyle.itemSeparator} />}
                
                SectionSeparatorComponent={() => <View style={localStyle.sectionSeparator} />}

                onEndReachedThreshold={2}
                onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
            />
          </View>

        ) : null;
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