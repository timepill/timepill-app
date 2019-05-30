import React, {Component} from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Color from '../style/color';
import Api from '../util/api';


const localStyle = StyleSheet.create({
    footer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15
    }
});

const ListFooterLoading = () => {
    return (
        <View style={localStyle.footer}>
            <ActivityIndicator animating={true} color={Color.primary}
                size={Api.IS_ANDROID ? 'large' : 'small'} />
        </View>
    );
}

const ListFooterEnd = () => {
    return (
        <View style={localStyle.footer}>
            <Text style={{color: Color.inactiveText, fontSize: 12}}>
                ——  THE END  ——
            </Text>
        </View>
    );
}

const ListFooterFailed = (props) => {
    let isRefreshable = props.refresh ? true : false;

    return (
        <View style={localStyle.footer}>
            <TouchableOpacity style={{marginTop: 15}}
                onPress={() => {
                    if(isRefreshable) {
                        props.refresh();
                    }
                }}
            >
                <Text style={{color: Color.primary}}>
                    加载失败{isRefreshable ? '，请点击重试' : ''}
                </Text>
            </TouchableOpacity>
        </View>
    );
}


export {
    ListFooterLoading,
    ListFooterEnd,
    ListFooterFailed
}

