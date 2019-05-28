import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import {Icon} from '../style/icon';
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

        if(passProps.editable) {
            topBar.rightButtons = [{
                id: 'navButtonNotebookSetting',
                icon: Icon.navButtonNotebookSetting,

                color: Color.primary
            }];
        }

        return {
            topBar
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

    render() {
        return (
            <View style={{flex: 1}}>
                <NotebookDiaryList notebook={this.props.notebook}
                    {...this.props}>
                </NotebookDiaryList>
            </View>
      );
    }
}

const localStyle = StyleSheet.create({

});
