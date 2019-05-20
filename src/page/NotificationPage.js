import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements'
import {Navigation} from 'react-native-navigation';

import Color from '../style/color'
import {Icon} from '../style/icon'


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

                  color: '#aaa' // android
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
          <View style={localStyle.container}>
              <Text style={localStyle.text}>没有内容</Text>
              <Button fontSize={14} borderRadius={999} backgroundColor={Color.primary}
                  title={'刷新'} onPress={() => {}} />
          </View>
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
