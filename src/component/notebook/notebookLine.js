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
            notebooks: props.notebooks || []
        };
    }

    componentDidMount() {
        let notebooks = this.props.refreshData()

        if(notebooks && notebooks.length > 0) {
            this.setState({
                notebooks
            })
        }
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
                                onPress={() => this.props.onNotebookPress(notebook)}>

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