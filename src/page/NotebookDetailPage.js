import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import Color from '../style/color';
import NotebookDiaryList from '../component/notebook/notebookDiaryList';


export default class NotebookDetailPage extends Component {

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <NotebookDiaryList notebook={this.props.notebook}></NotebookDiaryList>
            </ScrollView>
      );
    }
}

const localStyle = StyleSheet.create({

});
