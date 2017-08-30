import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, Animated } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FilesPlaceholder from './files-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import FileItem from './file-item';
import FileActions from './file-actions';
import fileState from './file-state';
import { upgradeForFiles } from '../payments/payments';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class Files extends SafeComponent {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }
    get isFabVisible() { return !fileState.showSelection; }

    @observable dataSource = null;
    @observable refreshing = false
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
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
            this.data.length,
            this.maxLoadedIndex
        ], () => {
            // console.log(`files.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice(0, this.maxLoadedIndex));
            this.forceUpdate();
        }, true);
    }

    item(file) {
        return (
            <FileItem key={file.fileId} file={file} />
        );
    }

    onEndReached = () => {
        // console.log('files.js: on end reached');
        this.maxLoadedIndex += PAGE_SIZE;
    }

    listView() {
        return (
            <ListView
                initialListSize={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                dataSource={this.dataSource}
                renderRow={this.item}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={20}
                enableEmptySections
                ref={sv => { this.scrollView = sv; }}
            />
        );
    }

    renderThrow() {
        const body = this.data.length ?
            this.listView() : !fileState.store.loading && <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {upgradeForFiles()}
                    {body}
                </View>
                <FileActions height={this.actionsHeight} />
                <ProgressOverlay enabled={fileState.store.loading} />
            </View>
        );
    }
}
