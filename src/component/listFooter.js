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

function renderFooterLoading() {
    return (
        <View style={localStyle.footer}>
            <ActivityIndicator animating={true} color={Color.primary}
                size={Api.IS_ANDROID ? 'large' : 'small'} />
        </View>
    );
}

function renderFooterEnd() {
    return (
        <View style={localStyle.footer}>
            <Text style={{color: Color.inactiveText, fontSize: 12}}>
                ——  THE END  ——
            </Text>
        </View>
    );
}

function renderFooterFailed(refresh) {
    let isRefreshable = refresh && typeof refresh == 'function';

    return (
        <View style={localStyle.footer}>
            <TouchableOpacity style={{marginTop: 15}}
                onPress={() => {
                    if(isRefreshable) {
                        refresh();
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


export default {
    renderFooterLoading,
    renderFooterEnd,
    renderFooterFailed
}

