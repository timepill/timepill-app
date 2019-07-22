/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>

#import "XGPush.h"
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
#import <UserNotifications/UserNotifications.h>
#endif
#import "RCTXGPushModule.h"
#import <Firebase.h>

@interface AppDelegate ()<XGPushDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  [[XGPush defaultManager] setEnableDebug:YES];
  XGNotificationAction *action1 = [XGNotificationAction actionWithIdentifier:@"xgaction001" title:@"xgAction1" options:XGNotificationActionOptionNone];
  XGNotificationAction *action2 = [XGNotificationAction actionWithIdentifier:@"xgaction002" title:@"xgAction2" options:XGNotificationActionOptionDestructive];
  XGNotificationCategory *category = [XGNotificationCategory categoryWithIdentifier:@"xgCategory" actions:@[action1, action2] intentIdentifiers:@[] options:XGNotificationCategoryOptionNone];
  XGNotificationConfigure *configure = [XGNotificationConfigure configureNotificationWithCategories:nil types:XGUserNotificationTypeAlert|XGUserNotificationTypeBadge|XGUserNotificationTypeSound];
  [[XGPush defaultManager] setNotificationConfigure:configure];
  [[XGPush defaultManager] startXGWithAppID:2200337125 appKey:@"IN15RCD511ZK" delegate:self];
  [[XGPush defaultManager] setXgApplicationBadgeNumber:0];
  [[XGPush defaultManager] reportXGNotificationInfo:launchOptions];

  [FIRApp configure];
  
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  
  return YES;
}

-(void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error{
  NSLog(@"[XGDemo] register APNS fail.\n[XGDemo] reason : %@", error);
  [[NSNotificationCenter defaultCenter] postNotificationName:@"registerDeviceFailed" object:nil];
}

/**
 收到通知的回调

 @param application  UIApplication 实例
 @param userInfo 推送时指定的参数
 */
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  NSLog(@"[XGDemo] receive Notification");
  [[XGPush defaultManager] reportXGNotificationInfo:userInfo];
  NSLog(@"ios 9 ");
  if( [UIApplication sharedApplication].applicationState == UIApplicationStateActive)
  {
    //NSLog(@"didReceiveRemoteNotification:APP在前台运行时，不做处理");
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }//当APP在后台运行时，当有通知栏消息时，点击它，就会执行下面的方法跳转到相应的页面
  else if([UIApplication sharedApplication].applicationState == UIApplicationStateInactive){
    // 取得 APNs 标准信息内容
    //NSLog(@"didReceiveRemoteNotification:APP在后台运行时，当有通知栏消息时，点击它，就会执行下面的方法跳转到相应的页面");
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }

}

/**
 收到静默推送的回调

 @param application  UIApplication 实例
 @param userInfo 推送时指定的参数
 @param completionHandler 完成回调
 */
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"[XGDemo] receive slient Notification");
  NSLog(@"[XGDemo] userinfo %@", userInfo);
  [[XGPush defaultManager] reportXGNotificationInfo:userInfo];

  if( [UIApplication sharedApplication].applicationState == UIApplicationStateActive)
  {
    //NSLog(@"didReceiveRemoteNotification:APP在前台运行时，不做处理");
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }//当APP在后台运行时，当有通知栏消息时，点击它，就会执行下面的方法跳转到相应的页面
  else if([UIApplication sharedApplication].applicationState == UIApplicationStateInactive){
    // 取得 APNs 标准信息内容
    //NSLog(@"didReceiveRemoteNotification:APP在后台运行时，当有通知栏消息时，点击它，就会执行下面的方法跳转到相应的页面");
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }

  completionHandler(UIBackgroundFetchResultNewData);
}


// iOS 10 新增 API
// iOS 10 会走新 API, iOS 10 以前会走到老 API
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
// App 用户点击通知
// App 用户选择通知中的行为
// App 用户在通知中心清除消息
// 无论本地推送还是远程推送都会走这个回调
- (void)xgPushUserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  NSLog(@"[XGDemo] click notification");
  //  if ([response.actionIdentifier isEqualToString:@"xgaction001"]) {
  //    NSLog(@"click from Action1");
  //  } else if ([response.actionIdentifier isEqualToString:@"xgaction002"]) {
  //    NSLog(@"click from Action2");
  //  }

  [[XGPush defaultManager] reportXGNotificationResponse:response];
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  //  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
  [[XGPush defaultManager] reportXGNotificationInfo:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  completionHandler();
}

// App 在前台弹通知需要调用这个接口
- (void)xgPushUserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [[XGPush defaultManager] reportXGNotificationInfo:notification.request.content.userInfo];
  NSLog(@"xgPushUserNotificationCenter");
  NSDictionary * userInfo = notification.request.content.userInfo;
  //  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
  [[XGPush defaultManager] reportXGNotificationInfo:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
}
#endif

#pragma mark - XGPushDelegate
- (void)xgPushDidFinishStart:(BOOL)isSuccess error:(NSError *)error {
  NSLog(@"%s, result %@, error %@", __FUNCTION__, isSuccess?@"OK":@"NO", error);
}

- (void)xgPushDidFinishStop:(BOOL)isSuccess error:(NSError *)error {
  NSLog(@"%s, result %@, error %@", __FUNCTION__, isSuccess?@"OK":@"NO", error);
}

@end
