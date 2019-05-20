import React, {Component} from 'react';
import {
    InteractionManager,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    Text, View
} from 'react-native';
import {Divider} from "react-native-elements";

import Touchable from '../touchable';
import Color from '../../style/color';
import Api from '../../util/api';

import Comment from './comment';


export default class CommentList extends Component {

    constructor(props) {
        super(props);

        this.diaryId = props.diaryId;
        this.state = {
            comments: []
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadMore();
        });
    }

    async loadMore() {
        let comments = await Api.getDiaryComments(this.diaryId);
        if(comments && comments.length > 0) {
            if (comments.length > 1) {
                comments = comments.reverse();
            }
            
            this.setState({
                comments
            });
        }
    }

    render() {
        return (
            <View style={localStyle.container}>
                <FlatList

                    data={this.state.comments}

                    keyExtractor={(item, index) => {
                        return item.id.toString()
                    }}

                    renderItem={({item}) => {
                        return (
                            <Touchable onPress={() => {}}>
                                <Comment comment={item}></Comment>
                            </Touchable>
                        )
                    }}

                    ListHeaderComponent={() => {
                        let count = this.state.comments.length;
                        return (
                            <View>
                                <View style={localStyle.line} />
                                <Text style={localStyle.header}>
                                  {count > 0 ? `共 ${count} 条回复` : '还没有人回复'}
                                </Text>
                            </View>
                        );
                    }}
                >
                </FlatList>

            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingBottom: Api.IS_IPHONEX ? 30 : 0
    },
    line: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Color.line,
        marginHorizontal: 15
    },
    header: {
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 20,
        color: Color.inactiveText
    }
});