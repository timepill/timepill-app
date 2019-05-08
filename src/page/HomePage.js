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
            diaries: []
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh()
                .then(data => {
                    console.log('homepage data:', data);

                    this.setState({
                        isLoading: false,
                        diaries: data && data.list ? data.list : []
                    });

                }).catch(e => {
                    if (e.code && e.code === 401) {
                        this.props.navigator.showModal({
                            screen: "App"
                        });

                        this.setState({
                            diaries: []
                        });
                    }
                });
        });
    }

    async refresh() {
        return await this.dataSource.refresh();
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
                            <DiaryFull diary={item}></DiaryFull>
                        </Touchable>
                    )
                }}

                ItemSeparatorComponent={({highlighted}) => <Divider style={{backgroundColor: '#eee'}}/>}
                
                automaticallyAdjustContentInsets={true}
                onEndReachedThreshold={2}
            />
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
    }
});
