import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import {Icon} from '../style/icon';

import NotificationList from '../component/notification/notificationList';


export default class NotificationHistoryPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '提醒历史'
              }
            }
        };
    }

    render() {
      return (
          <View style={localStyle.container}>
              <NotificationList {...this.props}></NotificationList>
          </View>
      );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1
    }
});
