import React, { Component } from 'react';
import {
    View,
    ScrollView,
    RefreshControl
} from 'react-native';
import { observable, when } from 'mobx';
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

    _onRefresh() {
        this.refreshing = true;
        fileStore.reloadAllFiles();
        when(() => !fileStore.loading, () => (this.refreshing = false));
    }

    render() {
        const files = fileStore.files.sort((f1, f2) => {
            return f2.uploadedAt - f1.uploadedAt;
        });
        const items = [];
        for (let i = 0; i < files.length; ++i) {
            items.push(<FileItem key={i} file={files[i]} />);
        }

        const refreshControl = (
            <RefreshControl
                refreshing={this.refreshing}
                onRefresh={() => this._onRefresh()}
            />
        );

        const actions = fileState.showSelection ? <FileActions /> : null;

        const body = fileStore.files.length ? (
            <ScrollView refreshControl={refreshControl}>
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
                {actions}
                <SnackBar />
            </View>
        );
    }
}

