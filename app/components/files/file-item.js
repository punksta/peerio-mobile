import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FileInnerItem from './file-inner-item';
import FolderInnerItem from './folder-inner-item';
import fileState from './file-state';
import { vars } from '../../styles/styles';
import RecentFileInnerItem from './recent-file-inner-item';

@observer
export default class FileItem extends SafeComponent {
    @observable store = {
        get checkBoxHidden() {
            return !fileState.showSelection;
        },

        set checkBoxHidden(value) {
            // noop
        }
    };

    select() {
        this.props.file.selected = true;
    }

    press(file) {
        if (fileState.showSelection) {
            file.selected = !file.selected;
        } else {
            fileState.routerMain.files(file);
        }
    }

    renderThrow() {
        const { file, isRecentFile } = this.props;
        return (
            <View style={{ backgroundColor: 'white', marginHorizontal: !isRecentFile ? vars.spacing.medium.mini2x : 0 }}>
                {isRecentFile && <RecentFileInnerItem file={file} />}
                {!isRecentFile && (file.isFolder ?
                    <FolderInnerItem folder={file} onPress={() => this.props.onChangeFolder(file)} /> :
                    <FileInnerItem file={file} onPress={f => this.press(f)} />)}
            </View>
        );
    }
}

FileItem.propTypes = {
    file: PropTypes.any.isRequired,
    onChangeFolder: PropTypes.any,
    isRecentFile: PropTypes.bool
};
