import Color from '../style/color'
import {Icon} from '../style/icon'

function config() {
    return {
        root: {
            bottomTabs: {
              id: 'MainBottomTab',
              options: {
                  bottomTabs: {
                      currentTabIndex: 0,
                      titleDisplayMode: 'alwaysShow' // android
                  }
              },
              children: [{
                    stack: {
                      children: [{
                        component: {
                          name: 'Home',
                          options: {
                            topBar: {
                              // visible: false,
                              title: {
                                text: '首页'
                              }
                            }
                          }
                        }
                      }],
                      options: {
                        bottomTab: {
                          text: '首页',
                          icon: Icon.homeIcon,

                          // ios
                          selectedIcon: Icon.homeSelectedIcon,

                          // android
                          iconColor: '#ccc',
                          selectedIconColor: Color.primary
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
                          text: '关注',
                          icon: Icon.followIcon,

                          // ios
                          selectedIcon: Icon.followSelectedIcon,

                          // android
                          iconColor: '#ccc',
                          selectedIconColor: Color.primary
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
                          text: '写日记',
                          icon: Icon.writeIcon,

                          // ios
                          selectedIcon: Icon.writeSelectedIcon,

                          // android
                          iconColor: '#ccc',
                          selectedIconColor: Color.primary
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
                          text: '提醒',
                          icon: Icon.tipIcon,

                          // ios
                          selectedIcon: Icon.tipSelectedIcon,

                          // android
                          iconColor: '#ccc',
                          selectedIconColor: Color.primary
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
                          text: '我',
                          icon: Icon.myIcon,

                          // ios
                          selectedIcon: Icon.mySelectIcon,

                          // android
                          iconColor: '#ccc',
                          selectedIconColor: Color.primary
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