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
import NotebookDiaryData from '../../dataLoader/notebookDiaryData';


export default class NotebookDiaryList extends Component {

    constructor(props) {
        super(props);

        this.dataSource = new NotebookDiaryData();
        this.notebook =  props.notebook;

        this.state = {
            diaries: [],
            hasMore: false,

            refreshing: false,
            refreshFailed: false
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

    refresh(loadMore = false) {
        this.setState({refreshing: true});
        this.dataSource.refresh(this.notebook.id, loadMore)
                .then(result => {
                    console.log('get notebook diaries:', result);

                    if(!result) {
                        throw {
                            message: 'refresh no result'
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
                        diaries: [],
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
        return this.notebook ? (
          <View style={localStyle.container}>
            <SectionList
                
                keyExtractor={(item, index) => item.id}

                sections={this.state.diaries}

                renderItem={(rowData) => {
                    return (<Touchable onPress={() => {}}>
                        <DiaryBrief diary={rowData.item}></DiaryBrief>
                    </Touchable>);
                }}
               
                renderSectionHeader={(info) => {
                    return (<View style={localStyle.sectionHeader}>
                        <Text>{info.section.title}</Text>
                    </View>);
                }}

                ListFooterComponent={this.renderFooter.bind(this)}

                automaticallyAdjustContentInsets={true}

                ItemSeparatorComponent={(sectionID, rowID, adjacentRowHighlighted) =>
                    <View key={`${sectionID}-${rowID}`} style={localStyle.itemSeparator} />}
                
                SectionSeparatorComponent={() => <View style={localStyle.sectionSeparator} />}

                onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
            />
          </View>

        ) : null;
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
    },
    footer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15
    }
});