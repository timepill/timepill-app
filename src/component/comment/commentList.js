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
        console.log('commentList:', this.diaryId);

        let comments = await Api.getDiaryComments(this.diaryId);
        console.log('comments:', comments);

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
                >
                </FlatList>
            </View>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.navBackground,
        justifyContent: 'space-between',
        paddingBottom: Api.IS_IPHONEX ? 30 : 0
    }
});