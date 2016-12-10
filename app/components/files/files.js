import React, { Component } from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import { fileStore } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import SnackBar from '../snackbars/snackbar';
import Fab from '../shared/fab';
import FilesPlaceholder from './files-placeholder';
// import styles, { vars } from '../../styles/styles';
import FileItem from './file-item';

export default class Files extends Component {
    render() {
        const files = fileStore.files;
        const items = [];
        for (let i = 0; i < files.length; ++i) {
            items.push(<FileItem key={i} file={files[i]} />);
        }

        for (let i = 30; i < 60; ++i) {
            const f = {
                name: `file sample ${i}.gif`,
                fileId: i
            };
            items.push(<FileItem key={i} file={f} />);
        }

        const body = fileStore.files.length ? (
            <ScrollView>
                <View style={{ flex: 0, backgroundColor: vars.bg }}>
                    {items}
                </View>
            </ScrollView>
        ) : <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                {body}
                <Fab />
                <SnackBar />
            </View>
        );
    }
}

