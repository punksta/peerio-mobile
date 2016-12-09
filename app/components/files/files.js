import React, { Component } from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import { fileStore } from '../../lib/icebear';
import SnackBar from '../snackbars/snackbar';
import FilesPlaceholder from './files-placeholder';
// import styles from '../../styles/styles';
import FileItem from './file-item';

const plusSize = 50;

const plusButtonStyle = {
    position: 'absolute',
    right: plusSize / 2,
    bottom: plusSize,
    width: plusSize,
    height: plusSize,
    backgroundColor: 'orange',
    borderRadius: plusSize / 2
};

export default class Files extends Component {
    render() {
        const files = fileStore.files;
        const items = [];
        for (let i = 0; i < files.length; ++i) {
            items.push(<FileItem key={i} file={files[i]} />);
        }

        const body = fileStore.files.length ? (
            <ScrollView>
                <View style={{ flex: 0 }}>
                    {items}
                </View>
            </ScrollView>
        ) : <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                {body}
                <View style={plusButtonStyle} />
                <SnackBar />
            </View>
        );
    }
}

