import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routerModal from '../routes/router-modal';
import routes from '../routes/routes';
import { popupInput } from '../shared/popups';
import { fileHelpers } from '../../lib/icebear';

@observer
export default class FilesActionSheet extends SafeComponent {
    DELETE_INDEX = 3;
    CANCEL_INDEX = 4;

    get items() {
        const result = [this.sharefile, this.moveFile, this.renameFile, this.deleteFile, this.cancel];
        return result;
    }

    get cancel() { return { title: tx('button_cancel') }; }

    get sharefile() {
        const { file } = this.props;
        return {
            title: tx('button_share'),
            action: () => {
                fileState.currentFile = file;
                routerModal.shareFileTo();
            }
        };
    }

    get moveFile() {
        const { file } = this.props;
        return {
            title: tx('Move'),
            action: () => {
                fileState.currentFile = file;
                routes.modal.moveFileTo();
            }
        };
    }

    get renameFile() {
        const { file } = this.props;
        console.log(file);
        return {
            title: tx('button_rename'),
            async action() {
                const newFileName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(file.name)
                );
                if (newFileName) await file.rename(`${newFileName}.${file.ext}`);
            }
        };
    }

    // Do we need to check if file is ready to be deleted ?
    get deleteFile() {
        const { file } = this.props;
        return {
            title: tx('button_delete'),
            async action() {
                fileState.deleteFile(file);
            }
        };
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = () => this._actionSheet.show();

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.onPress}
            />
        );
    }
}

FilesActionSheet.propTypes = {
    file: PropTypes.any
};
