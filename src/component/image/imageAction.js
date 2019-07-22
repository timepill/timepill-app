import ActionSheet from 'react-native-actionsheet-api';
import ImagePicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'


async function resize(uri, oWidth, oHeight, maxPixel) {
    let width = oWidth;
    let height = oHeight;
    let oPixel = oWidth * oHeight;

    if(oPixel > maxPixel) {
        width = Math.sqrt(oWidth * maxPixel / oHeight);
        height = Math.sqrt(oHeight * maxPixel / oWidth);
    }
    
    const newUri = await ImageResizer.createResizedImage(uri, width, height, 'JPEG', 75);
    return 'file://' + newUri.uri;
}

function action(imageOption, maxSize, maxPixel, callback) {
    ActionSheet.showActionSheetWithOptions({
        options: ['拍照', '从相册选择', '取消'],
        cancelButtonIndex: 2,
        title: '选择图片'

    }, (index) => {
        if(index == 0 || index == 1) {
            if(!imageOption) {
                return;
            }

            (
                index == 0
                ? ImagePicker.openCamera(imageOption)
                : ImagePicker.openPicker(imageOption)
            )
            .then(async (image) => {
                let imageUri = image.path;
                if(image.size > maxSize) {
                    imageUri = await resize(image.path, image.width, image.height, maxPixel);
                }

                callback(null, imageUri);
            })
            .catch(e => {
                if(e.message === "User cancelled image selection") {
                    return;
                }

                callback(e);
            })
        }
    });
}

export default {
    action
}
