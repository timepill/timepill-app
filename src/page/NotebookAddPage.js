import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Switch, TextInput, TouchableOpacity} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Color from '../style/color';
import {Icon} from '../style/icon';
import Api from '../util/api';

import DateInput from '../component/dateInput'


export default class NotebookAddPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            notebook: props.notebook,

            subject: '',
            isPublic: false,
            dateString: ''
        }
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '创建日记本'
              },
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

    navigationButtonPressed({buttonId}) {
        console.log('date string:', this.dateInput.getDate());
    }

    render() {
        return (
            <View style={localStyle.wrap}>

                <View style={localStyle.group}>
                    <View style={localStyle.item}>
                        <TextInput style={localStyle.subject}
                            underlineColorAndroid='transparent'
                            selectionColor={Color.primary}
                            autoCorrect={false}

                            placeholder="主题"
                            value={this.state.subject}

                            onChangeText={(text) => this.setState({subject: text})}
                        />
                    </View>
                    <View style={localStyle.line} />

                    <View>
                          <View style={localStyle.item}>
                              <DateInput ref={(r) => {this.dateInput = r}}
                                    style={localStyle.datePickerStyle}
                                    customStyles={customDatePickerStyle}>
                                </DateInput>
                          </View>
                    </View>
                    <View style={localStyle.line} />

                    <View style={localStyle.item}>
                        <Text style={localStyle.title}>公开日记本</Text>
                        <Switch value={this.state.isPublic}
                            onValueChange={(v) => this.setState({isPublic: v})}
                            trackColor={Api.IS_ANDROID ? Color.textSelect : null}
                            thumbColor={Api.IS_ANDROID && this.state.isPublic ? Color.light : null}
                        />
                    </View>
                </View>


            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#EFEFF4'
    },
    group: {
        marginTop: 30,
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 45
    },
    subject: {
        flex: 1,
        fontSize: 16,
        height: '100%',
        padding: 0
    },
    title: {
        fontSize: 16,
        color: '#222'
    },
    line: {
        marginLeft: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    datePickerStyle: {
        flex: 1,
        padding: 0,
        height: '100%',
        justifyContent: 'center'
    }
});

const customDatePickerStyle = StyleSheet.create({
    dateInput: {
        height: 45,
        alignItems: 'flex-start',
        borderWidth: 0
    },
    placeholderText: {
        fontSize: 16
    },
    dateText: {
        fontSize: 16
    }
});


