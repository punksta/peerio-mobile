import React, { Component } from 'react';
import {
    View,
    ListView,
    Animated
} from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import FilesPlaceholder from './files-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import FileItem from './file-item';
import FileActions from './file-actions';
import fileState from './file-state';

@observer
export default class Files extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }
    get isFabVisible() { return !fileState.showSelection; }

    @observable dataSource = null;
    @observable refreshing = false
    actionsHeight = new Animated.Value(0)

    get data() {
        return fileState.store.files.sort((f1, f2) => {
            return f2.uploadedAt - f1.uploadedAt;
        });
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

        this.reaction = reaction(() => [
            fileState.routerMain.route === 'files',
            fileState.routerMain.currentIndex === 0,
            this.data,
            this.data.length
        ], () => {
            console.log(`files.js: force update`);
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
            this.forceUpdate();
        }, true);
    }

    item(file) {
        return (
            <FileItem key={file.fileId} file={file} />
        );
    }

    listView() {
        return (
            <ListView
                initialListSize={1}
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
            this.listView() : !fileState.store.loading && <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {body}
                </View>
                <FileActions height={this.actionsHeight} />
                <ProgressOverlay enabled={fileState.store.loading} />
            </View>
        );
    }
}
