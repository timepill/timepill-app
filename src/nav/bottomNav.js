import Color from '../style/color'
import {Icon} from '../style/icon'

let insets = { // add this to change icon position (optional, iOS only).
  top: 6, // optional, default is 0.
  left: 0, // optional, default is 0.
  bottom: -6, // optional, default is 0.
  right: 0 // optional, default is 0.
};

function config(splash) {

    return {
        root: {
            bottomTabs: {
              id: 'MainBottomTab',
              options: {
                  bottomTabs: {
                      currentTabIndex: 0,
                      titleDisplayMode: 'alwaysHide' // android
                  }
              },
              children: [{
                    stack: {
                      children: [{
                        component: {
                          name: 'Home',
                          options: {
                            topBar: {
                              visible: false,
                              animate: false

                              /*
                              title: {
                                text: '首页'
                              }
                              */
                            },
                            bottomTabs: {
                                visible: false,
                                animate: false
                            }
                            
                          },
                          passProps: {
                            splash: splash
                          }
                        }
                      }],
                      options: {
                        bottomTab: {
                          text: '', //首页
                          icon: Icon.homeIcon,

                          // ios
                          selectedIcon: Icon.homeSelectedIcon,

                          // android
                          iconColor: '#aaa',
                          selectedIconColor: Color.primary,
                          iconInsets: insets,
                        }
                      }
                    }
              },{
                    stack: {
                      children: [{
                        component: {
                          name: 'Follow'
                        }
                      }],
                      options: {
                        bottomTab: {
                          text: '', //关注
                          icon: Icon.followIcon,

                          // ios
                          selectedIcon: Icon.followSelectedIcon,

                          // android
                          iconColor: '#aaa',
                          selectedIconColor: Color.primary,
                          iconInsets: insets,
                        }
                      }
                    }
              },{
                    stack: {
                      children: [{
                        component: {
                          name: 'Empty',
                          options: {
                            topBar: {
                                visible: false
                            }
                          }

                        }
                      }],
                      options: {
                        bottomTab: {
                          text: '', //写日记
                          icon: Icon.writeIcon,

                          // ios
                          selectedIcon: Icon.writeSelectedIcon,

                          // android
                          iconColor: '#aaa',
                          selectedIconColor: Color.primary,
                          iconInsets: insets,
                        }
                      }
                    }
              },{
                    stack: {
                      children: [{
                        component: {
                          name: 'Notification',
                          options: {
                            topBar: {
                              title: {
                                text: '提醒'
                              }
                            }
                          }
                        }
                      }],
                      options: {
                        bottomTab: {
                          text: '', //提醒
                          icon: Icon.tipIcon,

                          // ios
                          selectedIcon: Icon.tipSelectedIcon,

                          // android
                          iconColor: '#aaa',
                          selectedIconColor: Color.primary,
                          iconInsets: insets,
                        }
                      }
                    }
              },{
                    stack: {
                      children: [{
                        component: {
                          name: 'User',
                          options: {
                            topBar: {
                              title: {
                                text: '我'
                              }
                            }
                          }
                        }
                      }],
                      options: {
                        bottomTab: {
                          text: '', //我
                          icon: Icon.myIcon,

                          // ios
                          selectedIcon: Icon.mySelectIcon,

                          // android
                          iconColor: '#aaa',
                          selectedIconColor: Color.primary,
                          iconInsets: insets,
                        }
                      }
                    }
              }]
            }
        }
    }
}

export default {
    config
}