import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, Animated, Text } from 'react-native';
import { observable, reaction, computed } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FolderInnerItem from './folder-inner-item';
import FileInnerItem from './file-inner-item';
import fileState from './file-state';
import { vars } from '../../styles/styles';
import Center from '../controls/center';
import icons from '../helpers/icons';
import routes from '../routes/routes';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class FileSelect extends SafeComponent {
    @observable currentFolder = fileState.store.fileFolders.root;

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    @observable dataSource = null;
    @observable refreshing = false

    @computed get data() {
        return this.currentFolder.foldersAndFilesDefaultSorting;
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
            this.data.length
        ], () => {
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
            this.forceUpdate();
        }, true);
    }

    item = f => {
        const changeFolder = () => { this.currentFolder = f; };
        const submitSelection = () => fileState.submitSelectFiles([f]);
        return (
            f.isFolder ?
            <FolderInnerItem
                key={f.fId}
                folder={f}
                hideArrow={!f.hasNested || f.isRoot}
                onPress={f.hasNested ? changeFolder : null} /> :
            <FileInnerItem onPress={submitSelection} file={f} />
        );
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

    exitRow() {
        const container = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: vars.statusBarHeight,
            paddingBottom: 0,
            height: vars.headerHeight,
            borderBottomWidth: 1,
            borderBottomColor: '#EFEFEF'
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.semiBold,
            color: vars.txtMedium
        };
        const leftIcon = this.currentFolder.isRoot ?
            icons.dark('close', () => routes.modal.discard()) :
            icons.dark('arrow-back', () => { this.currentFolder = this.currentFolder.parent; });
        return (
            <View style={container}>
                {leftIcon}
                <Center style={style}><Text style={textStyle}>{tx('title_shareToChat')}</Text></Center>
                {icons.placeholder()}
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1, backgroundColor: vars.white }}>
                {this.exitRow()}
                {!this.data.length && !this.currentFolder.isRoot ?
                    this.noFilesInFolder : null}
                {this.listView()}
            </View>
        );
    }
}
