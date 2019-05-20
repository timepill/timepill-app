import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, InteractionManager} from 'react-native';

import Api from '../../util/api';
import Notification from './notification';


export default class NotificationList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            refreshing: false
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    refresh() {
        this.setState({refreshing: true});
        Api.getMessagesHistory()
            .then(notifications => {
                console.log('notifications:', notifications);

                this.setState({
                    notifications
                });

            }).done(() => {
                this.setState({refreshing: false});
            });
    }

    render() {
        let hasData = this.state.notifications && this.state.notifications.length > 0;
        return hasData ? (
            <FlatList
                data={this.state.notifications}

                keyExtractor={(item, index) => {
                    return item.id ? item.id.toString() : index
                }}

                renderItem={({item}) => {
                    return (
                        <Notification></Notification>
                    );
                }}

                refreshing={this.state.refreshing}
                onRefresh={this.refresh.bind(this)}

            />
        ) : null;
    }
}

const localStyle = StyleSheet.create({

});