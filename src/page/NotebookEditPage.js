import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Switch,
    TextInput,
    TouchableOpacity,
    DeviceEventEmitter,
    Keyboard,
    Alert
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import ActionSheet from 'react-native-actionsheet-api';
import ImagePicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'

import Color from '../style/color';
import {Icon} from '../style/icon';
import Msg from '../util/msg';
import Api from '../util/api';
import Event from "../util/event";

import Loading from '../component/loading'
import DateInput from '../component/dateInput'
import ImageAction from '../component/image/imageAction'


export default class NotebookEditPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            notebook: props.notebook,

            subject: props.notebook ? props.notebook.subject : '',
            isPublic: props.notebook ? props.notebook.isPublic : true,

            uploading: false,
            saving: false
        }
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: !passProps.notebook ? '创建日记本' : '修改日记本'
              },
              backButton: {
                  title: passProps.backTitle ? passProps.backTitle : '返回'
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
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        this.saveNotebook();
    }

    async saveNotebook() {
        let notebook = this.state.notebook;

        let subject = this.state.subject;
        let isPublic = this.state.isPublic;

        try{
            this.setState({saving: true});

            let result;
            if (!notebook) {
                let dateString = this.dateInput.getDate();
                result = await Api.createNotebook(subject, '', dateString, isPublic ? 10 : 1);

            } else {
                result = await Api.updateNotebook(notebook.id, subject, notebook.description, isPublic ? 10 : 1);
            }
            
            if(result) {
                Keyboard.dismiss();

                Msg.showMsg(!notebook ? '创建完成' : '保存完成');
                DeviceEventEmitter.emit(Event.updateNotebooks);

                Navigation.popToRoot(this.props.componentId);

            } else {
                throw {
                    message: 'save notebook failed'
                }
            }

        } catch(e) {
            console.log('e:', e);
            Msg.showMsg(!notebook ? '创建日记本失败' : '修改日记本失败');
        }

        this.setState({saving: false});
    }

    uploadCover(uri) {
        this.setState({uploading: true});
        Api.updateNotebookCover(this.props.notebook.id, uri)
            .then(result => {
                if(!result) {
                    throw {
                        message: 'upload notebook cover failed'
                    }
                }

                DeviceEventEmitter.emit(Event.updateNotebooks);
                Msg.showMsg('封面保存成功');
            })
            .catch(e => {
                Msg.showMsg('封面保存失败');
            })
            .finally(() => {
                this.setState({uploading: false});
            });
    }

    _onEditCover() {
        ImageAction.action({
            width: 640,
            height: 480,
            cropping: true

        }, -1, 600*600, (e, imageUri) => {
            
            if(e) {
                Msg.showMsg('操作失败');
            } else {
                this.uploadCover(imageUri);
            }
        });
    }

    _onDelete() {
        let notebookId = this.state.notebook ? this.state.notebook.id : null;
        if(!notebookId) {
            return;
        }

        Api.deleteNotebook(notebookId)
            .then(() => {
                DeviceEventEmitter.emit(Event.updateNotebooks);

                Alert.alert('提示', '日记本已删除', [{text: '好', onPress: () =>  {
                    Navigation.popToRoot(this.props.componentId);
                }}]);
            })
            .catch((err) => {
                Alert.alert('删除失败', err.message)
            });
    }

    openMargePage() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'NotebookMerge',
                passProps: {
                    notebook: this.props.notebook
                },
                options: {
                    bottomTabs: {
                        visible: false,

                        // hide bottom tab for android
                        drawBehind: true,
                        animate: true
                    }
                }
            }
        });
    }

    render() {
        const tip = this.props.notebook ? (
            <View style={{padding: 15}}>
                <Text style={localStyle.tip}>提示：写过的日记本不能被删除</Text>
            </View>
        ) : (
            <View style={{padding: 15}}>
                <Text style={[localStyle.tip, { paddingBottom: 3 }]}>什么是胶囊日记？</Text>
                <Text style={localStyle.tip}>胶囊日记是一个记录生活的日记本。</Text>
                <Text style={localStyle.tip}>
                    首先你需要建立一个胶囊日记本，公开或是私密，并为它设定一个期限，这个期限决定了这个日记本的“厚度”，然后你就可以开始写日记了。 你可以在上面记录喜悦，悲伤，发牢骚，流水账，甚至只是一张相片，一条电话号码。 之后你会发现，一觉醒来，前一天你和所有人的日记都不见了，放心，它们并没有被删除，只是存放在你建好的日记本里， 等到日记本“写满”那天，你所有的日记就都可以再次被浏览。
                </Text>
            </View>
        );

        return (
            <View style={localStyle.wrap}>
                <Loading visible={this.state.uploading}></Loading>

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

                    {
                        !this.state.notebook
                        ? (
                            <View>
                                  <View style={localStyle.item}>
                                      <DateInput ref={(r) => {this.dateInput = r}}
                                            style={localStyle.datePickerStyle}
                                            customStyles={customDatePickerStyle}>
                                        </DateInput>
                                  </View>
                                  <View style={localStyle.line} />
                            </View>
                        ) : null
                    }
                    

                    <View style={localStyle.item}>
                        <Text style={localStyle.title}>公开日记本</Text>
                        <Switch value={this.state.isPublic}
                            onValueChange={(v) => this.setState({isPublic: v})}
                            trackColor={Api.IS_ANDROID ? Color.textSelect : null}
                            thumbColor={Api.IS_ANDROID && this.state.isPublic ? Color.light : null}
                        />
                    </View>
                </View>

                {
                    this.state.notebook
                    ? (
                        <View>
                            <View style={localStyle.group}>
                                <TouchableOpacity style={localStyle.item}
                                    onPress={this._onEditCover.bind(this)}>
                                    <Text style={localStyle.editCover}>设置封面</Text>
                                </TouchableOpacity>
                                {(this.state.notebook.isExpired) && (
                                    <>
                                        <View style={localStyle.line} />
                                        <TouchableOpacity style={localStyle.item} onPress={this.openMargePage.bind(this)}>
                                            <Text style={localStyle.editCover}>合并日记本</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>

                            <View style={localStyle.group}>
                                <TouchableOpacity style={localStyle.item}
                                    onPress={this._onDelete.bind(this)}>
                                    <Text style={localStyle.delete}>删除</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null
                }
                {tip}

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
    },
    editCover: {
        flex: 1,
        textAlign: 'center',
        color: Color.light,
        fontSize: 16
    },
    delete: {
        flex: 1,
        textAlign: 'center',
        color: '#d9534f',
        fontSize: 16
    },
    tip: {
        fontSize: 12,
        color: '#89A',
        lineHeight: 18,
    },

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


