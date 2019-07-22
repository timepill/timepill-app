import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import firebase from 'react-native-firebase';

import Color from '../style/color';
import {Icon} from '../style/icon';

import NotificationList from '../component/notification/notificationList';


export default class NotificationHistoryPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        // firebase.crashlytics().crash();
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '提醒历史'
              }
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    render() {
      return (
          <View style={localStyle.container}>
              <NotificationList isHistory={true} isSetRead={false} {...this.props}></NotificationList>
          </View>
      );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1
    }
});
