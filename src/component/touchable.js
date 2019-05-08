import React from "react";
import {Platform, TouchableNativeFeedback, TouchableOpacity, View} from "react-native";


let TouchableIOS = (props) => {
    return <TouchableOpacity activeOpacity={0.7} {...props}/>
};

let TouchableAndroid = (props) => {
    return (
        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} useForeground={true} {...props}>
            <View>
                {props.children}
            </View>
        </TouchableNativeFeedback>
    )
};

const Touchable = Platform.OS === 'android' ? TouchableAndroid : TouchableIOS;
Touchable.propTypes = (Platform.OS === 'android' ? null : TouchableOpacity.propTypes);

export default Touchable