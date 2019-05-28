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
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import KeyboardSpacer from "react-native-keyboard-spacer";
import Ionicons from 'react-native-vector-icons/Ionicons';

import BottomNav from '../nav/bottomNav';
import {Icon} from '../style/icon';
import Color from '../style/color';
import Api from '../util/api';
import Msg from '../util/msg';
import Token from '../util/token'
import Event from "../util/event";

import NotebookLine from '../component/notebook/notebookLine';


export default class WritePage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        let diary = this.diary = props.diary;
        this.state = {
            notebooks: [],

            targetbookId: diary ? diary.notebook_id : 0,
            targetbookSubject: diary ? diary.notebook_subject : '',
            
            content: diary ? diary.content : '',

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
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        if(buttonId == 'cancel') {

            if(this.diary) {
                Navigation.pop(this.props.componentId);

            } else {
                Navigation.setStackRoot(this.props.componentId, {
                    component: {
                        name: 'Empty',
                        options: {
                            bottomTabs: {
                                visible: true
                            }
                        },
                        passProps: {
                            from: 'write'
                        }
                    }
                });
            }

        } else if(buttonId == 'save') {
            this.saveDiary();
        }
    }

    componentDidMount() {
        this.loadNotebook();

        this.notebookListener = DeviceEventEmitter.addListener(Event.updateNotebooks, (param) => {
            this.loadNotebook(true);
        });
    }

    componentWillUnmount(){
        this.notebookListener.remove();
    }

    openModal() {
        this.setState({modalVisible: true});

        if(this.state.notebooks.length == 0) {
            Alert.alert('提示', '没有可用日记本，无法写日记', [
                {text: '确定', onPress: () =>  {}}
            ]);
        }
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

    _onCreateNotebook() {
        this.closeModal(false);
        Navigation.push(this.props.componentId, {
            component: {
                name: 'NotebookEdit'
            }
        });
    }

    _onNotebookSelected(notebook) {
        this.setState({
          targetbookId: notebook.id,
          targetbookSubject: notebook.subject

        }, () => {
            this.closeModal();
        });
    }

    loadNotebook(resetTargetbook = false) {
        Api.getSelfNotebooks()
            .then(notebooks => {
                if(!notebooks || !notebooks.filter) {
                    notebooks = [];
                }

                let unExpiredBooks = notebooks.filter(it => !it.isExpired);
                if(unExpiredBooks.length > 0) {
                    let st = {
                        notebooks: unExpiredBooks
                    }

                    if(resetTargetbook || this.state.targetbookId == 0) {
                        st.targetbookId = unExpiredBooks[0].id;
                        st.targetbookSubject = unExpiredBooks[0].subject;
                    }

                    this.setState(st);
                }

            }).done();
    }

    saveDiary() {
        let photoUri = null;
        let topic = this.props.topic ? 1 : 0;

        (this.diary
          ? Api.updateDiary(this.diary.id, this.state.targetbookId, this.state.content)
          : Api.addDiary(this.state.targetbookId, this.state.content, null, topic)
        ).then(result => {
              Msg.showMsg('日记保存完成');
              DeviceEventEmitter.emit(Event.updateDiarys);

              this.props.onSave(result);

              if(this.diary) {
                  Navigation.pop(this.props.componentId);
              
              } else {
                  Navigation.setStackRoot(this.props.componentId, {
                      component: {
                          name: 'Empty',
                          options: {
                              bottomTabs: {
                                  visible: true
                              }
                          },
                          passProps: {
                              from: 'write'
                          }
                      }
                  });
              }
              
          })
          .catch(e => {
              Msg.showMsg('保存失败');
          })
          .done();
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

                  onChangeText={(text) => {
                      this.setState({content: text});
                  }}

                  autoCorrect={false}
                  autoCapitalize='none'
              />

              <View style={localStyle.bottomBar}>
                  <TouchableOpacity onPress={this.openModal.bind(this)}>
                      <View style={localStyle.notebookButton}>
                          <Ionicons name='ios-bookmarks-outline' size={16} 
                              color={Color.text} style={{marginTop: 2, marginRight: 6}} />
                          <Text style={{fontSize: 13, color: Color.text }}>
                              {this.state.targetbookSubject ? this.state.targetbookSubject : '..'}
                          </Text>
                      </View>
                  </TouchableOpacity>

                  <View style={{flex: 1}} />

                  <TouchableOpacity style={localStyle.photo} onPress={() => {}}>
                      <Ionicons name="ios-image-outline" size={30}
                          style={{paddingTop: 4}} color={Color.light} />
                  </TouchableOpacity>
              </View>

              {
                  Api.IS_IOS ? <KeyboardSpacer topSpacing={Api.IS_IPHONEX ? -30 : 0} /> : null
              }

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
                            <TouchableOpacity onPress={this._onCreateNotebook.bind(this)} style={localStyle.modalButton}>
                                <Text style={localStyle.modalButtonText}>新添</Text>
                            </TouchableOpacity>
                            <Text style={{padding: 10, color: Color.text}}>选择日记本</Text>
                            <TouchableOpacity onPress={this.closeModal.bind(this)} style={localStyle.modalButton}>
                                <Text style={localStyle.modalButtonText}>取消</Text>
                            </TouchableOpacity>
                        </View>

                        <NotebookLine
                            refreshData={() => this.state.notebooks}
                            onNotebookPress={this._onNotebookSelected.bind(this)}
                        ></NotebookLine>

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
        fontSize: 15
    }
});
