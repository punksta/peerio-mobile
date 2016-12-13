import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Animated,
    RefreshControl
} from 'react-native';
import { observable, when, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { fileStore } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import SnackBar from '../snackbars/snackbar';
import Fab from '../shared/fab';
import FilesPlaceholder from './files-placeholder';
// import styles, { vars } from '../../styles/styles';
import FileItem from './file-item';
import FileActions from './file-actions';
import fileState from './file-state';

@observer
export default class Files extends Component {
    @observable refreshing = false
    actionsHeight = new Animated.Value(0)

    componentDidMount() {
        reaction(() => fileState.showSelection, v => {
            const duration = 200;
            const toValue = v ? 80 : 0;
            Animated.timing(this.actionsHeight, { toValue, duration }).start();
        });
    }

    _onRefresh() {
        this.refreshing = true;
        fileStore.reloadAllFiles();
        when(() => !fileStore.loading, () => (this.refreshing = false));
    }

    render() {
        console.log(`files.js: render: ${fileStore.files.length}`);
        const files = fileStore.files.sort((f1, f2) => {
            return f2.uploadedAt - f1.uploadedAt;
        });

        const refreshControl = (
            <RefreshControl
                refreshing={this.refreshing}
                onRefresh={() => this._onRefresh()}
            />
        );

        const body = files.length ? (
            <ScrollView refreshControl={refreshControl}>
                <View style={{ flex: 0, backgroundColor: vars.bg }}>
                    {fileStore.files.map(file => <FileItem key={file.id} file={file} />)}
                </View>
            </ScrollView>
        ) : <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {body}
                    <Fab />
                </View>
                <FileActions height={this.actionsHeight} />
                <SnackBar />
            </View>
        );
    }
}

