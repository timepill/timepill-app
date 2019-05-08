import Color from '../style/color'
import {Icon} from '../style/icon'

const insets = {
    top: 6,
    left: 0,
    bottom: -6,
    right: 0
};

function config() {
    return {
        tabs: [
            {
                // label: '首页',
                screen: 'Home',
                icon: Icon.homeIcon,
                selectedIcon: Icon.homeSelectedIcon, // iOS only
                title: '首页',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                }
            },
            {
                // label: '关注',
                screen: 'Follow',
                icon: Icon.followIcon,
                selectedIcon: Icon.followSelectedIcon, // iOS only
                title: '关注',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                }
            },
            {
                // label: '写日记',
                screen: 'Write',
                icon: Icon.writeIcon,
                selectedIcon: Icon.writeSelectedIcon, // iOS only
                title: '写日记',
                iconInsets: insets,
                overrideBackPress: true,
                navigatorStyle: {
                    tabBarHidden: true,
                },
                passProps: {
                    tabOpen: true,
                }
            },
            {
                // label: '提醒',
                screen: 'Notification',
                icon: Icon.tipIcon,
                selectedIcon: Icon.tipSelectedIcon, // iOS only
                title: '提醒',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                }
            },
            {
                // label: '我的',
                screen: 'User',
                icon: Icon.myIcon,
                selectedIcon: Icon.mySelectIcon, // iOS only
                title: '我的',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                },
                passProps: {
                    isMyself: true,
                    tabOpen: true,
                }
            }
        ],
        tabsStyle: {
            tabBarHidden: true,
            tabBarSelectedButtonColor: Color.primary,

            navBarTranslucent: false,
            statusBarTextColorScheme: 'dark',
            drawUnderNavBar: true,

            initialTabIndex: 0,
        },
        appStyle: {
            tabBarHidden: true,
            tabBarBackgroundColor: Color.navBackground,
            tabBarButtonColor: '#999',
            tabBarSelectedButtonColor: Color.primary,

            navBarTranslucent: false,
            navBarBackgroundColor: Color.navBackground,
            navigationBarColor: Color.navBackground,
            
            statusBarTextColorScheme: 'dark',
            statusBarColor: Color.navBackground,

            keepStyleAcrossPush: false,
            topBarBorderColor: '#ddd',
            drawUnderStatusBar: false,
            orientation: 'portrait',
            initialTabIndex: 0,
        },
        animationType: 'fade'
    }
}

export default {
    config
}