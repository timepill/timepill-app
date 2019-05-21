import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Alert,
    InteractionManager,
    TouchableOpacity
} from 'react-native';

import Api from '../../util/api';
import Notebook from './notebook'


export default class NotebookLine extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notebooks: []
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.load();
        });
    }

    load() {
        Api.getSelfNotebooks()
            .then(notebooks => {
                if(!notebooks || !notebooks.filter) {
                    notebooks = [];
                }

                const unExpiredBooks = notebooks.filter(it => !it.isExpired);
                if(unExpiredBooks.length === 0) {
                    Alert.alert('提示', '没有可用日记本,无法写日记', [
                        {text: '取消', onPress: () =>  {}},
                        {text: '创建一个', onPress: () => {}}
                    ]);
                }

                this.setState({
                    notebooks: unExpiredBooks
                });

            }).done(() => {});
    }

    render() {
        return (
            <ScrollView horizontal={true}
                        contentContainerStyle={localStyle.container}

                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='always'

                        snapToAlignment='start'
                        snapToInterval={300}

                        decelerationRate={0}
                        showsHorizontalScrollIndicator={true}
            >
                {
                    this.state.notebooks.map((notebook) => {
                        return (
                            <TouchableOpacity key={notebook.id} activeOpacity={0.7}                                
                                onPress={this.props.onNotebookPress}>

                                <Notebook key={notebook.id} style={{paddingRight: 10}}
                                    notebook={notebook} />
                            </TouchableOpacity>
                        );
                    })
                }

            </ScrollView>
        );
    }
}

const localStyle = StyleSheet.create({
    container: {
        padding: 10,
        paddingRight: 0,
        paddingBottom:0
    }
});