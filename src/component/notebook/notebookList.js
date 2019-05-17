import React, { Component } from 'react';
import {
    InteractionManager,
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity
} from 'react-native';

import Api from '../../util/api';
import Notebook from './notebook'


export default class NotebookList extends Component {

    constructor(props) {
        super(props);

        this.itemsPerRow = 2;
        this.state = {
            notebooks: [],
            refreshing: false
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    createGroup(items, itemsPerRow) {
        let bucket = [];
        let groups = [];

        items.forEach(function (item) {
            if(bucket.length === itemsPerRow) {
                groups.push(bucket);
                bucket = [item];

            } else {
                bucket.push(item);
            }
        });

        if(bucket.length > 0) {
            while(bucket.length < itemsPerRow) {
                bucket.push(null);
            }

            groups.push(bucket);
        }

        return groups;
    }

    refresh() {
        this.setState({refreshing: true});
        Api.getSelfNotebooks()
            .then(notebooks => {
                console.log('get notebooks:', notebooks);
                
                let groups = this.createGroup(notebooks, this.itemsPerRow);
                this.setState({
                    notebooks: groups
                });

            }).done(() => {
                this.setState({refreshing: false});
            });
    }

    _renderItem(notebook) {
        return notebook ? (
            <TouchableOpacity key={notebook.id} activeOpacity={0.7}
                onPress={() => this.props.onNotebookPress(notebook)}>

                <Notebook key={notebook.id} notebook={notebook} />

            </TouchableOpacity>
        ) : null
    }

    render() {
        let hasData = this.state.notebooks && this.state.notebooks.length > 0;
        return hasData ? (
            <FlatList style={{marginTop: 15}}
                data={this.state.notebooks}

                keyExtractor={(item, index) => {
                    return item[0].id.toString()
                }}

                renderItem={({item}) => {
                    let row = item.map((notebook) => {
                        return this._renderItem(notebook);
                    });

                    return (
                        <View style={localStyle.row}>
                            {row}
                        </View>
                    );
                }}

                refreshing={this.state.refreshing}
                onRefresh={this.refresh.bind(this)}

            />
        ) : null;
    }
}

const localStyle = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    item: {
        marginBottom: 15
    }
});

