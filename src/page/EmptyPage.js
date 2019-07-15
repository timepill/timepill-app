import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import {Navigation} from 'react-native-navigation';


export default class EmptyPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            from: props.from
        }
    }

    static options(passProps) {
        return {
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
        this.navigationEventListener.remove();
    }

    
    componentDidAppear() {
        let forword = true;
        if(this.state.from == 'write') {
            forword = false;
            this.setState({from: ''});
        }

        if(!forword) {
            
            Navigation.mergeOptions(this.props.componentId, {
                bottomTabs: {
                    currentTabIndex: 4
                }
            });
            

        } else {
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'Write',
                    options: {
                        animations: {
                            push: {
                                enabled: false
                            },
                            pop: {
                                enabled: false
                            }
                        },
                        bottomTabs: {
                            visible: false,

                            // hide bottom tab for android
                            drawBehind: true,
                            animate: true
                        }
                    },
                    passProps: {

                    }
                }
            });
        }
        
    }
    

    render() {
        return null;
    }
}