import Ionicons from "react-native-vector-icons/Ionicons";
import {Platform} from "react-native";

let Icon = {
    homeIcon : null,
    homeSelectedIcon: null,

    followIcon: null,
    followSelectedIcon: null,

    writeIcon: null,
    writeSelectedIcon: null,

    tipIcon: null,
    tipSelectedIcon: null,

    myIcon: null,
    mySelectIcon: null,

    navButtonSave: null,
    navButtonClose: null,

    navButtonFollow: null,
    navButtonFollowSelected: null,
    navButtonMore: null,
    navButtonSetting: null,
    navButtonNotebookSetting: null,
    navButtonWrite: null,

    navButtonBack: null,
    navButtonOpen: null,

    navButtonTime: null
};

const outline = Platform.OS === 'ios' ? '-outline' : '';
const iconColor = '#333333';

async function loadIcon() {

    let localIcons = await Promise.all([
        Ionicons.getImageSource('ios-home' + outline, 26),
        Ionicons.getImageSource('ios-home', 26),

        Ionicons.getImageSource('ios-heart' + outline, 26),
        Ionicons.getImageSource('ios-heart', 26),

        Ionicons.getImageSource('ios-create' + outline, 26),
        Ionicons.getImageSource('ios-create', 26),

        Ionicons.getImageSource('ios-notifications' + outline, 26),
        Ionicons.getImageSource('ios-notifications', 26),

        Ionicons.getImageSource('ios-contact' + outline, 26),
        Ionicons.getImageSource('ios-contact', 26),

        
        Ionicons.getImageSource('md-checkmark', 28, iconColor),
        Ionicons.getImageSource('md-close', 28, iconColor),

        Ionicons.getImageSource('ios-heart-outline', 26, iconColor),
        Ionicons.getImageSource('ios-heart', 26, "#d9534f"),
        Ionicons.getImageSource(Platform.OS === 'ios' ? 'ios-more' : 'md-more', 26, iconColor),
        Ionicons.getImageSource(Platform.OS === 'ios' ? 'ios-settings' : 'md-settings', 26, iconColor),
        Ionicons.getImageSource(Platform.OS === 'ios' ? 'ios-switch' : 'ios-switch', 26, iconColor),
        Ionicons.getImageSource(Platform.OS === 'ios' ? 'ios-create-outline' : 'ios-create', 26, iconColor),

        Ionicons.getImageSource(Platform.OS === 'ios' ? 'md-arrow-back' : 'md-arrow-back', 26, iconColor),
        Ionicons.getImageSource(Platform.OS === 'ios' ? 'ios-open-outline' : 'md-open', 26, iconColor),

        Ionicons.getImageSource(Platform.OS === 'ios' ? 'md-time' : 'md-time', 26, iconColor)
        
    ]);

    let index = 0;
    for(let name in Icon) {
        Icon[name] = localIcons[index];
        index++;
    }
}

export {
    Icon,
    loadIcon
}
