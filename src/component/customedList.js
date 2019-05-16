import React, {Component} from 'react';
import {StyleSheet, Text, View, InteractionManager, FlatList} from 'react-native';


export default class CustomedList extends Component {

    constructor(props) {
        super(props);

        this.listType = props.listType || 'undefined';
        this.dataSource = props.dataSource;

        this.state = {
            listData: [],
            hasMore: false,

            refreshing: false,
            refreshFailed: false
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    refresh(loadMore = false) {
        if (this.state.refreshing) {
            return;
        }

        this.setState({hasMore: false, refreshing: true, refreshFailed: false});
        this.dataSource.refresh(loadMore)
                .then(result => {
                    if(!result) {
                        throw {
                            message: 'refresh ' + this.listType + ' no result'
                        }

                    } else {
                        console.log('refresh ' + this.listType + ' result:', result);

                        this.setState({
                            listData: result.list ? result.list : [],
                            hasMore: result.more,
                            refreshFailed: false
                        });
                    }

                }).catch(e => {
                    this.setState({
                        listData: [],
                        hasMore: false,
                        refreshFailed: true
                    });

                }).done(() => {
                    this.setState({
                        refreshing: false
                    });
                });
    }

    loadMore() {
        if (this.state.refreshing) {
            return;
        }

        this.refresh(true);
    }

    render() {
        return (
            <FlatList

                data={this.state.listData}

                keyExtractor={(item, index) => {
                    return item.id ? item.id.toString() : index;
                }}

                renderItem={this.props.renderItem}

                refreshing={this.state.refreshing}
                onRefresh={this.refresh.bind(this)}

                onEndReachedThreshold={5}
                onEndReached={this.state.hasMore ? this.loadMore.bind(this) : null}
            />
        );
    }
}

const localStyle = StyleSheet.create({
    
});
