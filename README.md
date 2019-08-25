# 胶囊日记 App

## 已知问题

### iOS 上的问题
1. image picker 在与 ReactNativeNavigation 共存时，会导致 image picker 在选择照片时不自动滚动到视图底部
（底部的照片是最近的照片），可以通过修改 image picker 源码解决

文件 node_modules/react-native-image-crop-picker/ios/QBImagePicker/QBImagePicker/QBAssetsViewController.m
107 行
```
    // Scroll to bottom
-   if (self.fetchResult.count > 0 && self.isMovingToParentViewController && !self.disableScrollToBottom) {
+   if (self.fetchResult.count > 0 && !self.disableScrollToBottom) {
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:(self.fetchResult.count - 1) inSection:0];
        [self.collectionView scrollToItemAtIndexPath:indexPath atScrollPosition:UICollectionViewScrollPositionTop animated:NO];
    }
```

### android 上的问题
1. react-native-actionsheet-api bug

https://github.com/qfight/react-native-actionsheet-api/issues/4