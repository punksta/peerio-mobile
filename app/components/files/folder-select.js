import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView } from 'react-native';
import { observable, reaction, computed } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import FolderInnerItem from './folder-inner-item';
import fileState from './file-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import routes from '../routes/routes';
import { popupMoveToSharedFolder } from '../shared/popups';
import { tx } from '../utils/translator';
import preferenceStore from '../settings/preference-store';
import ModalHeader from '../shared/modal-header';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class FolderSelect extends SafeComponent {
    @observable currentFolder = fileState.store.folderStore.root;

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    @observable dataSource = null;
    @observable refreshing = false;

    @computed get data() {
        const { currentFolder } = this;
        const folders = currentFolder.foldersSortedByName.slice();
        currentFolder.isRoot && folders.unshift(fileState.store.folderStore.root);
        return folders;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
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

    item = folder => {
        const selectFolder = async () => {
            const file = fileState.currentFile;
            if (!file) return;
            if (folder.isShared) {
                if (!preferenceStore.prefs.showMoveSharedFolderPopup) folder.attach(file);
                else {
                    const result = await popupMoveToSharedFolder();
                    if (result) {
                        preferenceStore.prefs.showMoveSharedFolderPopup = !result.checked;
                        folder.attach(file);
                    }
                }
            } else folder.attach(file);
            routes.modal.discard();
        };
        const changeFolder = () => {
            this.currentFolder = folder;
        };
        return (
            <FolderInnerItem
                radio
                key={folder.id}
                folder={folder}
                hideOptionsIcon={!folder.hasNested || folder.isRoot}
                onSelect={selectFolder}
                onPress={folder.hasNested ? changeFolder : selectFolder} />
        );
    };

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
        return <Text style={s}>{tx('title_noFilesInFolder')}</Text>;
    }

    exitRow() {
        const leftIcon = this.currentFolder.isRoot ?
            icons.dark('close', () => routes.modal.discard()) :
            icons.dark('arrow-back', () => { this.currentFolder = this.currentFolder.parent; });
        const fontSize = vars.font.size.normal;
        const title = 'title_moveFileTo';
        const outerStyle = { marginBottom: 0 };
        return <ModalHeader {...{ leftIcon, title, fontSize, outerStyle }} />;
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
