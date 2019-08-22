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
    Alert,
    Image,
    InteractionManager,
    SafeAreaView
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import KeyboardSpacer from "react-native-keyboard-spacer";
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Icon} from '../style/icon';
import Color from '../style/color';
import Api from '../util/api';
import Msg from '../util/msg';
import Event from "../util/event";

import NotebookLine from '../component/notebook/notebookLine';
import ImageAction from '../component/image/imageAction'
import { getBottomSpace } from 'react-native-iphone-x-helper';


export default class WritePage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        let diary = this.diary = props.diary;
        let topic = this.topic = props.topic;

        this.state = {
            notebooks: [],

            targetbookId: diary ? diary.notebook_id : 0,
            targetbookSubject: diary ? diary.notebook_subject : '',
            
            content: diary ? diary.content : '',
            photoSource: null,
            photoUri: null,

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
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        if(buttonId == 'cancel') {

            if(!(this.state.content.length === 0 || (this.diary && this.diary.content === this.state.content))) {
                Alert.alert('提示', '你编辑的日记尚未保存，离开会使内容丢失', [
                    {
                        text: '取消', onPress: () => {}
                    },
                    {
                        text: '确定离开', onPress: () => {
                            this.closePage();
                        }
                    }
                ]);
            } else {
                this.closePage();
            }

        } else if(buttonId == 'save') {
            this.saveDiary();
        }
    }

    closePage() {
        this.contentInput.blur();
        if (this.diary || this.topic) {
            Navigation.pop(this.props.componentId);

        } else {
            Navigation.dismissModal(this.props.componentId);
        }
    }

    componentDidMount() {
        this.loadNotebook().then(notebookCount => {
            if(notebookCount > 0) {
                InteractionManager.runAfterInteractions(() => {
                    this && this.contentInput && this.contentInput.focus();
                });
            } else {
                Alert.alert('提示', '没有可用日记本，无法写日记',[
                    {text: '取消', onPress: () => {}},
                    {text: '创建一个', onPress: () => {
                        Navigation.push(this.props.componentId, {
                            component: {
                                name: 'NotebookEdit'
                            }
                        });
                    }}
                ]);
            }
        });

        this.notebookListener = DeviceEventEmitter.addListener(Event.updateNotebooks, (param) => {
            this.loadNotebook(true);
        });
    }

    componentWillUnmount(){
        this.notebookListener.remove();
    }

    openModal() {
        this.contentInput.blur();
        this.setState({modalVisible: true});
    }

    closeModal(showKeyboard = true, callback) {
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
            if(!finished) {
                return;
            }

            this.setState({modalVisible: false}, () => {
                setTimeout(() => {
                    if(showKeyboard) {
                        this && this.contentInput && this.contentInput.focus()
                    } else {
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                }, 100);
            });
        });
    }

    _onCreateNotebook() {
        this.closeModal(false, () => {
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'NotebookEdit'
                }
            });
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

    async loadNotebook(resetTargetbook = false) {
        let notebooks = await Api.getSelfNotebooks();
        if(!notebooks || !notebooks.filter) {
            notebooks = [];
        }

        let unExpiredBooks = notebooks.filter(it => !it.isExpired);
        if(unExpiredBooks && unExpiredBooks.length > 0) {
            let st = {
                notebooks: unExpiredBooks
            }

            if(resetTargetbook || this.state.targetbookId == 0) {
                st.targetbookId = unExpiredBooks[0].id;
                st.targetbookSubject = unExpiredBooks[0].subject;
            }

            this.setState(st);
        }

        return unExpiredBooks && unExpiredBooks.length > 0 ? unExpiredBooks.length : 0;
    }

    _onPickPhoto() {
        if(this.state.photoUri != null) {
            ActionSheet.showActionSheetWithOptions({
                options: ['预览照片', '删除照片', '取消'],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 2

            }, (index) => {
                if(index == 0) {
                    Navigation.push(this.props.componentId, {
                        component: {
                            name: 'Photo',
                            passProps: {
                                url: this.state.photoUri
                            }
                        }
                    });

                } else if(index == 1) {
                    this.setState({
                        photoSource: null,
                        photoUri: null
                    });
                }
            });

        } else {
            ImageAction.action({
                cropping: false,
                mediaType: 'photo'

            }, 1024 * 1024 * 2, 2560 * 1920, (e, imageUri) => {
                if(e) {
                    console.error(e);
                    Msg.showMsg('操作失败' + e.toString());
                } else {
                    this.setState({
                        photoSource: {
                            uri: imageUri,
                            isStatic: true
                        },
                        photoUri: imageUri
                    });
                }
            });
        }
    }

    saveDiary() {
        if (!this.state.content) {
            return;
        }

        if (this.state.targetbookId == 0) {
            if (this.state.notebooks.length == 0) {
                this.contentInput.blur();
                Alert.alert('提示', '没有可用日记本，无法写日记', [
                    {
                        text: '取消', onPress: () => {
                        }
                    },
                    {
                        text: '创建一个', onPress: () => {
                            Navigation.push(this.props.componentId, {
                                component: {
                                    name: 'NotebookEdit'
                                }
                            });
                        }
                    }
                ]);

            } else {
                Alert.alert('提示', '选择一个日记本先', [
                    {text: '确定', onPress: () => this.openModal()}
                ]);
            }

            return;
        }

        let photoUri = this.state.photoUri;
        let topic = this.props.topic ? 1 : 0;

        let waitingToast = Msg.showMsg('正在保存中', {
            duration: 10000,
            position: -75,
            shadow: false,
            hideOnPress: false
        });

        (this.diary
                ? Api.updateDiary(this.diary.id, this.state.targetbookId, this.state.content)
                : Api.addDiary(this.state.targetbookId, this.state.content, photoUri, topic)
        ).then(result => {
            Msg.hideMsg(waitingToast);
            Msg.showMsg('日记保存完成');
            DeviceEventEmitter.emit(Event.updateDiarys);
            this.closePage();
        }).catch(e => {
            Msg.hideMsg(waitingToast);
            Msg.showMsg('保存失败');
        });
    }

    render() {
      return (
          <SafeAreaView style={{flex: 1, backgroundColor: Color.navBackground}}>
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

                  {this.renderTopicButton()}
                  {this.renderPhotoButton()}
                  
              </View>

              {
                  Api.IS_IOS ? <KeyboardSpacer topSpacing={-getBottomSpace()} /> : null
              }

              {this.renderModal()}

          </ScrollView>
          </SafeAreaView>
      );
    }

    renderTopicButton() {
        if(!this.topic) {
            return null;
        }

        let topicTitle = this.topic.title;
        if(topicTitle && topicTitle.length > 6) {
            topicTitle = topicTitle.substring(0, 6) + '..';
        }

        return (
            <TouchableOpacity>
                <Text style={{color: Color.light, fontSize: 15, paddingRight: 15}}>
                  # {topicTitle}
                </Text>
            </TouchableOpacity>
        )
    }

    renderPhotoButton() {
        if(this.diary) {
            return null;
        }

        let content = !this.state.photoSource
                      ? (<Ionicons name="ios-image-outline" size={30} style={{paddingTop: 4}} color={Color.light} />)
                      : (<Image source={this.state.photoSource} style={{width: 30, height: 30, borderRadius: 3}} />);

        return (
          <TouchableOpacity style={localStyle.photo}
              onPress={this._onPickPhoto.bind(this)}>
                  {content}
          </TouchableOpacity>
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
                                    ? 250
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
                            {
                                !this.diary ?
                                <TouchableOpacity onPress={this._onCreateNotebook.bind(this)} style={localStyle.modalButton}>
                                    <Text style={localStyle.modalButtonText}>新添</Text>
                                </TouchableOpacity> : <Text/>
                            }

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
