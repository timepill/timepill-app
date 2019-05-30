import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements'
import {Navigation} from 'react-native-navigation';

import Color from '../style/color'
import {Icon} from '../style/icon'

import {ListEmptyRefreshable} from '../component/listEmpty'


export default class NotificationPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '提醒'
              },
              rightButtons: [{
                  id: 'history',
                  icon: Icon.navButtonTime,

                  color: Color.primary // android
              }]
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'NotificationHistory'
            }
        });
    }

    render() {
        return (
            <ListEmptyRefreshable message={'没有提醒:)'}></ListEmptyRefreshable>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent: 'center',
        height: '100%'
    },
    text: {
        paddingBottom: 15,
        color: Color.text
    }
});
