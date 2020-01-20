import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import BlockUserList from '../component/block/blockUserList';


export default class BlockUserPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    static options(passProps) {
        return {
            topBar: {
              title: {
                  text: '屏蔽'
              }
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
    }

    render() {
        return (
          <View style={localStyle.wrap}>
                <BlockUserList ref={(r) => this.list = r}
                    {...this.props}
                ></BlockUserList>
          </View>
        );
    }
}


const localStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 1
    }
});

