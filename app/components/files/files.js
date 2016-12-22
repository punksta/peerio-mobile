import React, { Component } from 'react';
import {
    View,
    // Text,
    // ScrollView,
    ListView,
    Animated,
    RefreshControl
} from 'react-native';
import { observable, when, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { fileStore } from '../../lib/icebear';
// import { vars } from '../../styles/styles';
import FilesPlaceholder from './files-placeholder';
// import styles, { vars } from '../../styles/styles';
import FileItem from './file-item';
import FileActions from './file-actions';
import fileState from './file-state';
import mainState from '../main/main-state';

@observer
export default class Files extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }
    get isFabVisible() { return true; }

    @observable dataSource = null;
    @observable refreshing = false
    actionsHeight = new Animated.Value(0)

    get data() {
        return fileStore.files.sort((f1, f2) => {
            return f2.uploadedAt - f1.uploadedAt;
        });
    }

    componentWillMount() {
        this.reaction = reaction(() => (mainState.route === 'files') && this.data && this.data.length, () => {
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
            this.forceUpdate();
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        reaction(() => fileState.showSelection, v => {
            const duration = 200;
            const toValue = v ? 56 : 0;
            Animated.timing(this.actionsHeight, { toValue, duration }).start();
        });
    }

    _onRefresh() {
        this.refreshing = true;
        fileStore.reloadAllFiles();
        when(() => !fileStore.loading, () => (this.refreshing = false));
    }

    item(file) {
        return (
            <FileItem key={file.fileId} file={file} />
        );
    }

    listView() {
        const refreshControl = (
            <RefreshControl
                refreshing={this.refreshing}
                onRefresh={() => this._onRefresh()}
            />
        );
        return (
            <ListView
                initialListSize={1}
                refreshControl={refreshControl}
                dataSource={this.dataSource}
                renderRow={this.item}
                onContentSizeChange={this.scroll}
                enableEmptySections
                ref={sv => (this.scrollView = sv)}
            />
        );
    }

    render() {
        const body = this.data.length ?
            this.listView() : <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {body}
                </View>
                <FileActions height={this.actionsHeight} />
            </View>
        );
    }
}
