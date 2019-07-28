import React, { Component } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    TouchableWithoutFeedback,
    CameraRoll
} from "react-native";
import {Navigation} from 'react-native-navigation';
import ActionSheet from 'react-native-actionsheet-api';
import moment from "moment";
import Toast from 'react-native-root-toast';
import RNFetchBlob from "rn-fetch-blob";
import ImageZoom from 'react-native-image-pan-zoom';
import Image from 'react-native-image-progress';

import Msg from '../util/msg';
import Api from '../util/api';


export default class PhotoPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            width: 0,
            height: 0
        };
    }

    static options(passProps) {
        return {
            topBar: {
                visible: false,

                // hide top bar for android
                drawBehind: true,
                animate: true
            },
            statusBar: {
                backgroundColor: 'black'
            },
            bottomTabs: {
                visible: false,

                // hide bottom tab for android
                drawBehind: true,
                animate: true
            }
        };
    }

    close() {
        Navigation.pop(this.props.componentId);
    }

    onLongPress() {
        ActionSheet.showActionSheetWithOptions({
            options:['保存照片', '取消'],
            cancelButtonIndex:1

        }, (index) => {
            if(index == 0) {
                this.savePhoto();
            }
        });
    }

    async savePhoto() {
        let msgOption = {
            duration: 2000,
            position: Toast.positions.BOTTOM,
            shadow: false,
            hideOnPress: true,
        }

        try {
            if(Api.IS_ANDROID) {
                let dirs = RNFetchBlob.fs.dirs;
                let path = dirs.DownloadDir + '/timepill/' + moment().format('YYYYMMDD-hhmmss') + '.jpg';
                let res = await RNFetchBlob
                                .config({path})
                                .fetch('GET', this.props.url, {});
                
                await RNFetchBlob.fs.scanFile([{
                    path: res.path()
                }]);
                
            } else {
                await CameraRoll.saveToCameraRoll(this.props.url);
            }

            Msg.showMsg('照片已保存', msgOption);

        } catch (err) {
            console.error(err);
            Msg.showMsg('照片保存失败', msgOption);
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'black'}}
                onLayout={(event) => {
                    let {x, y, width, height} = event.nativeEvent.layout;
                    this.setState({
                        width: width,
                        height: height
                    })
                }}
            >
                <ImageZoom 
                    cropWidth={this.state.width}
                    cropHeight={this.state.height}
                    
                    imageWidth={this.state.width}
                    imageHeight={this.state.height}

                    doubleClickInterval={250}
                    onClick={() => this.close()}
                    onLongPress={this.onLongPress.bind(this)}
                >
                    <Image style={{flex: 1, width: '100%', height: '100%'}}
                        source={{uri: this.props.url,}}
                        resizeMode="contain"

                        indicator={loadingView}
                        renderError={errorView}
                    />
                </ImageZoom>
            </View>
        );
    }
}

function loadingView(props) {
    let process = Math.floor(props.progress * 100);
    let text = process > 0 ? process + '%' : '';
    return (
        <View>
            <ActivityIndicator animating={true} color="#FFF"
                size={Api.IS_ANDROID ? 'large' : 'small'}/>
            <Text style={{color: 'white', padding: 5, fontSize: 14}}>{text}</Text>
        </View>
    )
}

function errorView(props) {
    return (
        <Text>加载失败</Text>
    );
}