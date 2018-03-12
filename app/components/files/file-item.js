import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { observable, action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FileInnerItem from './file-inner-item';
import FolderInnerItem from './folder-inner-item';
import fileState from './file-state';
import { vars } from '../../styles/styles';

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

    @action.bound onFileActionPress() {
        const { file, onFileActionPress } = this.props;
        onFileActionPress(file);
    }

    @action.bound onFolderPress(folder) {
        const { onChangeFolder } = this.props;
        onChangeFolder(folder);
    }

    @action.bound onFolderActionPress() {
        const { file, onFolderActionPress } = this.props;
        onFolderActionPress(file);
    }

    renderThrow() {
        const { file } = this.props;
        return (
            <View style={{ backgroundColor: 'white', marginHorizontal: vars.spacing.medium.mini2x }}>
                {file.isFolder ?
                    <FolderInnerItem folder={file} onPress={this.onFolderPress} onFolderActionPress={this.onFolderActionPress} /> :
                    <FileInnerItem file={file} onPress={f => this.press(f)} onFileActionPress={this.onFileActionPress} />}
            </View>
        );
    }
}

FileItem.propTypes = {
    file: PropTypes.any.isRequired,
    onChangeFolder: PropTypes.any,
    onFileActionPress: PropTypes.func,
    onFolderActionPress: PropTypes.func
};
