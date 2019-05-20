import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '../style/icon'
import Color from '../style/color'
import Api from '../util/api'


export default class WritePage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            content: ''
        }
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '写日记'
              },
              leftButtons: [{
                  id: 'cancel',
                  icon: Icon.navButtonClose
              }],
              rightButtons: [{
                  id: 'save',
                  icon: Icon.navButtonSave
              }]
            },
            bottomTabs: {
                visible: false,

                // hide bottom tab for android
                drawBehind: true,
                animate: true
            }
        };
    }

    render() {
      return (
          <ScrollView style={localStyle.container}
              contentContainerStyle={{flex: 1}}
              keyboardShouldPersistTaps='always'>

              <TextInput ref={(r) => this.contentInput = r }
                  
                  style={localStyle.textContent}
                  selectionColor={Color.light}
                  underlineColorAndroid='transparent'
                  
                  multiline={true} maxLength={2000}
                  
                  placeholder='记录点滴生活'
                  value={this.state.content}

                  onChangeText={() => {}}

                  autoCorrect={false}
                  autoCapitalize='none'
              />

              <View style={localStyle.bottomBar}>
                  <TouchableOpacity onPress={() => {}}>
                      <View style={localStyle.notebookButton}>
                          <Ionicons name='ios-bookmarks-outline' size={16} 
                              color={Color.text} style={{marginTop: 2, marginRight: 6}} />
                          <Text style={{fontSize: 13, color: Color.text }}>{'日记本名'}</Text>
                      </View>
                  </TouchableOpacity>

                  <View style={{flex: 1}} />

                  <TouchableOpacity>
                      <Text style={localStyle.topic}># {'话题名'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={localStyle.photo} onPress={() => {}}>
                      <Ionicons name="ios-image-outline" size={30}
                          style={{paddingTop: 4}} color={Color.light} />
                  </TouchableOpacity>
              </View>

          </ScrollView>
      );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.navBackground,
        paddingBottom: Api.IS_IPHONEX ? 30 : 0
    },
    textContent: {
        flex: 1,
        padding: 15,
        paddingTop: 10,
        fontSize: 15,
        backgroundColor: '#fff',
        lineHeight: 24,
        color: Color.text,
        textAlignVertical:'top'
    },
    bottomBar: {
        height: 50,
        backgroundColor: Color.navBackground,
        elevation: 3,
        borderColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    notebookButton: {
        flexDirection: "row",
        borderRadius: 99,
        paddingHorizontal: 15,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.warning
    },
    topic: {
        color: Color.light,
        fontSize: 15,
        paddingRight: 15
    },
    photo: {
        width: 45,
        height: 40,
        alignItems: "center",
        justifyContent: 'center'
    }
});
