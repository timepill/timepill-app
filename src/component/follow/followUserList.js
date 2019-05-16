import React, {Component} from 'react';
import {StyleSheet, Text, View, InteractionManager, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Touchable from '../touchable';
import Color from '../../style/color';

import UserIcon from '../userIcon';
import CustomedList from '../customedList';


export default class FollowUserList extends Component {

    constructor(props) {
        super(props);

        this.dataSource = props.dataSource;
        this.listType = props.listType;
    }

    render() {
        return (
          <View style={localStyle.container}>
            <CustomedList listType={this.props.listType} style={localStyle.list}

                dataSource={this.props.dataSource}

                renderItem={({item}) => {
                    return (
                      <Touchable key={item.id} onPress={() => {}}>
                        <View style={localStyle.box}>
                            <UserIcon iconUrl={item.iconUrl}></UserIcon>
                            <Text style={localStyle.userName}>{item.name}</Text>
                            <Touchable onPress={() => {}}>
                                <Ionicons name="md-close" size={20}
                                    style={localStyle.removeIcon}
                                    color={Color.inactiveText} />
                            </Touchable>
                        </View>
                      </Touchable>
                    );
                }}
            />
          </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        height: '100%'
    },
    box: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Color.line,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 25
    },
    userName: {
        flex: 1,
        color: Color.text,
        fontSize: 16
    },
    removeIcon: {
        padding: 20
    }
});
