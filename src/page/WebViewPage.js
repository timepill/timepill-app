import React, {Component} from 'react';
import {
    WebView,
    Linking,
    BackHandler
} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {Icon} from '../style/icon'


export default class WebViewPage extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.webViewState = {
            canGoBack: false,
            canGoForward: false,
            loading: true,
            target: 0,
            url: this.props.uri
        };
    }

    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: '加载中...'
                },
                leftButtons: [{
                    id: 'back', icon: Icon.navButtonBack
                }],
                rightButtons: [{
                    id: "open",
                    icon: Icon.navButtonOpen
                }]
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
    }

    navigationButtonPressed({buttonId}) {
        if(buttonId == 'back') {
            this.goBack();

        } else if(buttonId == 'open') {
            Linking.openURL(this.webViewState.url);
        }
    }

    goBack = () => {
        if (this.webViewState.canGoBack) {
            this.webView.injectJavaScript('window.history.back();');

        } else {
            Navigation.pop(this.props.componentId);
        }
        return true;
    };

    onNavigationStateChange(event) {
        this.webViewState = event;
        
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: event.title
                }
            }
        });
        
    }

    render() {
        return (
            <WebView ref={(r) => this.webView = r}
                style={{flex: 1}}
                source={{uri: this.props.uri}}
                onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            />
        );
    }
}