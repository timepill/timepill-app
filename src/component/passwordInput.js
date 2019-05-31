import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    InteractionManager,
    Keyboard,
    Alert
} from 'react-native';

import Api from '../util/api'


export default class PasswordInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };
    }
    
    componentDidMount() {
        
        InteractionManager.runAfterInteractions(() => {
            this._onPress();
        });
        
    }

    componentWillUnMount() {
         Keyboard.dismiss();
    }

    clear() {
        this.setState({
            text: ''
        })
    }

    _onPress() {
        
        setTimeout(() => {
            this.inputText.focus();
        }, 500);
        
    }

    render() {
        return (
            <TouchableHighlight activeOpacity={1} underlayColor='transparent'
                onPress={this._onPress.bind(this)}
            >
                <View style={[localStyle.container, this.props.style]}>
                    <TextInput ref={(r) => this.inputText = r}
                        style={localStyle.textInput}
                        
                        maxLength={this.props.maxLength}
                        autoFocus={false}
                        keyboardType={Api.IS_IOS ? "number-pad" : 'numeric'}
                        blurOnSubmit={false}

                        value={this.state.text}
                        onChangeText={
                            (text) => {
                                this.setState({text});
                                if(text.length === this.props.maxLength) {
                                    this.props.onEnd(text);
                                }
                            }
                        }
                    />
                    {
                        this._getInputItem()
                    }
                </View>
            </TouchableHighlight>
        )

    }

    _getInputItem() {
        let inputItem = [];
        let text = this.state.text;

        for(let i=0; i<parseInt(this.props.maxLength); i++) {
            if(i == 0) {
                inputItem.push(
                    <View key={i} style={[localStyle.inputItem, this.props.inputItemStyle]}>
                        {i < text.length ? <View style={[localStyle.iconStyle, this.props.iconStyle]}/> : null}
                    </View>
                );
            } else {
                inputItem.push(
                    <View key={i} style={[localStyle.inputItem, localStyle.inputItemBorderLeftWidth, this.props.inputItemStyle]}>
                        {i < text.length ? <View style={[localStyle.iconStyle, this.props.iconStyle]}/> : null}
                    </View>)
            }
        }

        return inputItem;
    }
}

const localStyle = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 5
    },
    textInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1,
        height:1,
        padding: 0,
        margin: 0
    },
    inputItem: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc'
    },
    iconStyle: {
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8
    }
});