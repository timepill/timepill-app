import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import {
  PagerScroll,
  TabView,
  TabBar,
  SceneMap
} from 'react-native-tab-view';
import {Navigation} from 'react-native-navigation';

import Api from '../util/api';
import Color from '../style/color';

import NotebookList from '../component/notebook/notebookList'


export default class UserPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'userInfo', title: '简介' },
                { key: 'diary', title: '日记' },
                { key: 'notebook', title: '日记本' }
            ]
        };
    }

    _onNotebookPress(notebook) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'NotebookDetail',
                passProps: {
                    notebook: notebook
                }
            }
        });
        
    }

    _renderLabel = props => ({route}) => {
        let routes = props.navigationState.routes;
        let index = props.navigationState.index;

        let color = route.key == routes[index].key ? Color.primary : '#222';
        
        return (
            <Animated.Text
                style={[localStyle.label, {color}]}>
                {route.title}
            </Animated.Text>
        );
    };

    _renderTabBar = props => {
        return (
          <TabBar
            {...props}
            style={localStyle.tabBar}
            indicatorStyle={localStyle.indicator}

            renderLabel={this._renderLabel(props)}
          >
          </TabBar>
        );
    };

    _renderScene = SceneMap({
        userInfo: () => <View style={localStyle.container}><Text style={localStyle.welcome}>user info !</Text></View>,
        diary: () => <View style={localStyle.container}><Text style={localStyle.welcome}>diary !</Text></View>,
        notebook: () => <NotebookList
            onNotebookPress={this._onNotebookPress.bind(this)}
            navigator={this.props.navigator}
        />
    });

    render() {
      return (
          <TabView style={localStyle.container}
              initialLayout={{
                  height: 0,
                  width: Api.DEVICE_WINDOW.width
              }}

              renderPager={(props) => <PagerScroll {...props}/>} /* android */

              renderTabBar={this._renderTabBar}
              renderScene={this._renderScene}

              navigationState={this.state}
              onIndexChange={index => {
                  this.setState({index});
              }}
              
          />
      );
    }
}

const localStyle = StyleSheet.create({
    
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      marginTop: 40
    },


    container: {
        flex: 1
    },
    tabBar: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 5
    },
    indicator: {
        backgroundColor: Color.primary
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold'
    }
});
