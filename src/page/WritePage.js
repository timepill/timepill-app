import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    Animated,
    Easing,
    TouchableWithoutFeedback
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '../style/icon'
import Color from '../style/color'
import Api from '../util/api'

import NotebookLine from '../component/notebook/notebookLine'


export default class WritePage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            content: '',

            modalVisible: false,
            fadeAnimOpacity: new Animated.Value(0),
            fadeAnimHeight: new Animated.Value(0)
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

    openModal() {
        this.setState({modalVisible: true});
    }

    closeModal(showKeyboard = true) {
        this.contentInput.blur();
        Animated.parallel([
            Animated.timing(
                this.state.fadeAnimOpacity,
                {
                    toValue: 0,
                    duration: 350,
                    easing: Easing.out(Easing.cubic)
                }
            ),
            Animated.timing(
                this.state.fadeAnimHeight,
                {
                    toValue: 0,
                    duration: 350,
                    easing: Easing.out(Easing.cubic)
                }
            )
        ]).start(({finished}) => {
            this.setState({modalVisible: false});
            if(!finished) {
                return;
            }
            if(showKeyboard) {
                setTimeout(() => this.contentInput.focus(), 100);
            }
        });
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
                  <TouchableOpacity onPress={this.openModal.bind(this)}>
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

              {this.renderModal()}

          </ScrollView>
      );
    }

    renderModal() {
        return (
            <Modal animationType='none' transparent={true}
                visible={this.state.modalVisible}
                onShow={() => {
                    Animated.parallel([
                        Animated.timing(
                            this.state.fadeAnimOpacity,
                            {
                                toValue: 0.4,
                                duration: 350,
                                easing: Easing.out(Easing.cubic)
                            }
                        ),
                        Animated.timing(
                            this.state.fadeAnimHeight,
                            {
                                toValue: Api.IS_IOS
                                    ? (Api.IS_IPHONEX ? 280 : 250)
                                    : 260,
                                duration: 350,
                                easing: Easing.out(Easing.cubic)
                            }
                        )
                    ]).start();
                }}
                onRequestClose={() => {}}
            >
                <View style={{flex: 1}}>
                    <TouchableWithoutFeedback onPress={this.closeModal.bind(this)} style={{flex: 1}}>
                        <Animated.View style={{ flex: 1, backgroundColor: "black", opacity: this.state.fadeAnimOpacity }} />
                    </TouchableWithoutFeedback>

                    <Animated.View style={{height: this.state.fadeAnimHeight, backgroundColor: '#fff'}}>
                        <View style={localStyle.modalBanner}>
                            <TouchableOpacity onPress={() => {}} style={localStyle.modalButton}>
                                <Text style={localStyle.modalButtonText}>新添</Text>
                            </TouchableOpacity>
                            <Text style={{padding: 10, color: Color.text}}>选择日记本</Text>
                            <TouchableOpacity onPress={this.closeModal.bind(this)} style={localStyle.modalButton}>
                                <Text style={localStyle.modalButtonText}>取消</Text>
                            </TouchableOpacity>
                        </View>

                        <NotebookLine onNotebookPress={() => {}}></NotebookLine>

                    </Animated.View>
                </View>
            </Modal>
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
    },

    modalBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: '#e2e2e2',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    modalButton: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    modalButtonText: {
        color: Color.light,
        fontSize: 15,
    }
});
