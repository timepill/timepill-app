import React, {Component} from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import {Icon} from '../style/icon';
import Event from '../util/event';
import NotebookDiaryList from '../component/notebook/notebookDiaryList';


export default class NotebookDetailPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
    }

    static options(passProps) {
        let topBar = {
            title: {
                text: '《' + passProps.notebook.subject + '》'
            }
        }

        if(passProps.isMine) {
            topBar.rightButtons = [{
                id: 'navButtonNotebookSetting',
                icon: Icon.navButtonNotebookSetting,
            }];
        }

        return {
            topBar
            ,
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'NotebookEdit',
                passProps: {
                    notebook: this.props.notebook
                }
            }
        });
    }

    componentDidMount() {
        this.diaryListener = DeviceEventEmitter.addListener(Event.updateDiarys, (param) => {
            this.diaryList.refresh();
        });
    }

    componentWillUnmount() {
        this.diaryListener.remove();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <NotebookDiaryList ref={(r) => this.diaryList = r}
                    notebook={this.props.notebook}
                    {...this.props}>
                </NotebookDiaryList>
            </View>
      );
    }
}

const localStyle = StyleSheet.create({

});
