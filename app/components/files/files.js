import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, Animated, Text } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FilesPlaceholder from './files-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import FileItem from './file-item';
import FolderActionSheet from './folder-action-sheet';
import FilesActionSheet from './files-action-sheet';
import fileState from './file-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import { upgradeForFiles } from '../payments/payments';
import BackIcon from '../layout/back-icon';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

let filesActionSheet = null;

function backFolderAction() {
    fileState.currentFolder = fileState.currentFolder.parent;
}

@observer
export default class Files extends SafeComponent {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    get leftIcon() {
        if (fileState.currentFolder.isRoot) return null;
        return <BackIcon action={backFolderAction} />;
    }

    get rightIcon() {
        return <PlusBorderIcon action={() => filesActionSheet.show()} />;
    }

    get layoutTitle() {
        if (fileState.currentFolder.isRoot) return null;
        return fileState.currentFolder.name;
    }

    @observable dataSource = null;
    @observable refreshing = false
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
    actionsHeight = new Animated.Value(0)

    get data() {
        return fileState.currentFolder.foldersAndFilesDefaultSorting;
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
            this.currentFolder,
            this.data,
            this.data.length,
            this.maxLoadedIndex
        ], () => {
            // console.log(`files.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice(0, this.maxLoadedIndex));
            this.forceUpdate();
        }, true);
    }

    onChangeFolder = folder => { fileState.currentFolder = folder; }

    item = file => {
        return (
            <FileItem
                key={file.fileId || file.folderId}
                file={file}
                onChangeFolder={this.onChangeFolder}
                onLongPress={() => this._folderActionSheet.show(file)} />
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

    get noFilesInFolder() {
        if (this.data.length || fileState.currentFolder.isRoot) return null;
        const s = {
            color: vars.txtMedium,
            textAlign: 'center',
            marginTop: vars.headerSpacing
        };
        return <Text style={s}>{tx('title_noFilesInFolder')}</Text>;
    }

    renderThrow() {
        const body = (this.data.length || !fileState.currentFolder.isRoot) ?
            this.listView() : !fileState.store.loading && <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {upgradeForFiles()}
                    {!this.data.length && !fileState.currentFolder.isRoot ?
                        this.noFilesInFolder : null}
                    {body}
                </View>
                <ProgressOverlay enabled={fileState.store.loading} />
                <FolderActionSheet ref={ref => { this._folderActionSheet = ref; }} />
                <FilesActionSheet createFolder ref={ref => { filesActionSheet = ref; }} />
            </View>
        );
    }
}
