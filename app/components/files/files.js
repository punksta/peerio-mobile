import React, { Component } from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import { fileStore } from '../../lib/icebear';
import SnackBar from '../snackbars/snackbar';
// import styles from '../../styles/styles';
import FileItem from './file-item';

export default class Files extends Component {
    render() {
        const files = fileStore.files;
        const items = [];
        for (let i = 0; i < files.length; ++i) {
            items.push(<FileItem key={i} file={files[i]} />);
        }
        return (
            <View
                style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ flex: 0 }}>
                        {items}
                    </View>
                </ScrollView>
                <SnackBar />
            </View>
        );
    }
}

