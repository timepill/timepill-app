import Toast from 'react-native-root-toast';

function showMsg(msg) {
    if (!msg) {
        return;
    }

    Toast.show(msg, {
        duration: 2500,
        position: -75,
        shadow: false,
        hideOnPress: true,
    });
}

export default {
    showMsg
}