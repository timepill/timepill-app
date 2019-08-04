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
        this.bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
            if(selectedTabIndex === 2) {
                Navigation.showModal({
                    stack: {
                        children: [{
                            component: {
                                name: 'Write',
                                passProps: {
                                    text: 'stack with one child'
                                },
                                bottomTabs: {
                                    visible: false,

                                    // hide bottom tab for android
                                    drawBehind: true,
                                    animate: true
                                }
                            }
                        }]
                    }
                });

                setTimeout(() => {
                    Navigation.mergeOptions(this.props.componentId, {
                        bottomTabs: {
                            currentTabIndex: unselectedTabIndex
                        }
                    });
                }, 1000)
            }
        });
    }

    componentWillUnmount() {
        this.navigationEventListener.remove();
        this.bottomTabEventListener.remove();
    }

    
    componentDidAppear() {

    }
    

    render() {
        return null;
    }
}