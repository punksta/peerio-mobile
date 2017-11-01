import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, Animated, Text } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FilesPlaceholder from './files-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import FileItem from './file-item';
import FileActions from './file-actions';
import fileState from './file-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import { upgradeForFiles } from '../payments/payments';
import BackIcon from '../layout/back-icon';
import { vars } from '../../styles/styles';
import imagePicker from '../helpers/imagepicker';
import { popupInputCancelCheckbox } from '../shared/popups';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class Files extends SafeComponent {
    @observable currentFolder = fileState.store.fileFolders.root;

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    get leftIcon() {
        if (this.currentFolder.isRoot) return null;
        const action = () => { this.currentFolder = this.currentFolder.parent; };
        return <BackIcon action={action} />;
    }

    get rightIcon() {
        const buttons = [
            { name: 'createFolder', title: 'Create a folder' }
        ];
        const createFolder = async () => {
            const result = await popupInputCancelCheckbox(
                'Create a folder', 'Enter a folder name', null, null, true);
            if (!result) return;
            requestAnimationFrame(() => {
                fileState.store.fileFolders.createFolder(result.value, this.currentFolder);
                fileState.store.fileFolders.save();
            });
        };
        const action = () => imagePicker.show(buttons, fileState.upload, createFolder);
        return <PlusBorderIcon action={action} />;
    }

    @observable dataSource = null;
    @observable refreshing = false
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
    actionsHeight = new Animated.Value(0)

    get data() {
        const { currentFolder } = this;
        const folders = currentFolder.folders;
        const files = currentFolder.files.sort((f1, f2) => {
            return f2.uploadedAt - f1.uploadedAt;
        });
        return folders.concat(files);
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

    onChangeFolder = folder => { this.currentFolder = folder; }

    item = file => {
        return (
            <FileItem
                key={file.fileId || file.folderId}
                file={file}
                onChangeFolder={this.onChangeFolder}
                onLongPress={() => fileState.store.fileFolders.deleteFolder(file)} />
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
        if (this.data.length || this.currentFolder.isRoot) return null;
        const s = {
            color: vars.txtMedium,
            textAlign: 'center',
            marginTop: vars.headerSpacing
        };
        return <Text style={s}>No files in this folder</Text>;
    }

    renderThrow() {
        const body = (this.data.length || !this.currentFolder.isRoot) ?
            this.listView() : !fileState.store.loading && <FilesPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {upgradeForFiles()}
                    {!this.data.length && !this.currentFolder.isRoot ?
                        this.noFilesInFolder : null}
                    {body}
                </View>
                <FileActions height={this.actionsHeight} />
                <ProgressOverlay enabled={fileState.store.loading} />
            </View>
        );
    }
}
