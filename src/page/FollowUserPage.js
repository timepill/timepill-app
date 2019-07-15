import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import {
  PagerScroll,
  TabView,
  TabBar,
  SceneMap
} from 'react-native-tab-view';

import Api from '../util/api';
import Color from '../style/color';
import FollowUserList from '../component/follow/followUserList'
import FollowingUserData from '../dataLoader/followingUserData'
import FollowedByUserData from '../dataLoader/followedByUserData'


export default class FollowUserPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'following', title: '我关注的' },
                { key: 'followedBy', title: '关注我的' }
            ]
        };
    }

    static options(passProps) {
        return {
            topBar: {
                noBorder: true, // ios
                elevation: 0, // android

                title: {
                    text: '关注用户'
                }
            },
            statusBar: {
                backgroundColor: 'white',
                style: 'dark'
            }
        };
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
        following: () => <FollowUserList
            listType={'followingUser'} dataSource={new FollowingUserData()}
            onDeletePress={async (id) => {
                return Api.deleteFollow(id);
            }}
            {...this.props}
        />,
        followedBy: () => <FollowUserList
            listType={'followedByUser'} dataSource={new FollowedByUserData()}
            onDeletePress={async (id) => {
                return Api.deleteFollowBy(id);
            }}
            {...this.props}
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
        margin: 10,
        marginTop: 35
    },

    container: {
        flex: 1
        , backgroundColor: 'white'
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
