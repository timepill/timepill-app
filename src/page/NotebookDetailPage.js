import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import Color from '../style/color';
import NotebookDiaryList from '../component/notebook/notebookDiaryList';


export default class NotebookDetailPage extends Component {

    render() {
        return (
            <View style={{flex: 1}}>
                <NotebookDiaryList notebook={this.props.notebook}></NotebookDiaryList>
            </View>
      );
    }
}

const localStyle = StyleSheet.create({

});
