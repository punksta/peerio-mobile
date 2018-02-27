import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import FileTypeIcon from '../files/file-type-icon';
import icons from '../helpers/icons';
import SafeComponent from '../shared/safe-component';
import ButtonText from '../controls/button-text';
import Thumbnail from '../shared/thumbnail';
import popupState from '../layout/popup-state';
import routes from '../routes/routes';
import fileState from './file-state';
import { fileHelpers, chatStore, config } from '../../lib/icebear';

// TODO Workaround negative margin
const buttonContainer = {
    flex: 0,
    marginTop: vars.spacing.large.mini,
    marginBottom: -12,
    marginRight: -12,
    flexDirection: 'row',
    justifyContent: 'flex-end'
};

const nameContainer = {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: vars.spacing.small.midi2x,
    paddingTop: vars.spacing.small.mini,
    paddingBottom: vars.spacing.small.midi2x,
    flexGrow: 1
};

// Padding 0 should be kept
const inputStyle = {
    color: vars.lighterBlackText,
    paddingVertical: 0,
    paddingLeft: 0,
    height: vars.searchInputHeight
};

const shareContainer = {
    marginVertical: vars.spacing.medium.mini,
    flexDirection: 'row',
    alignItems: 'center'
};

const shareTextStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.extraSubtleText,
    marginBottom: vars.spacing.small.mini
};

const recipientStyle = {
    fontSize: vars.font.size.normal,
    color: vars.lighterBlackText
};

/* const messageInputStyle = {
    height: vars.inputHeightLarge,
    fontSize: vars.font.size.normal,
    paddingLeft: vars.iconPadding,
    textAlignVertical: 'top',
    backgroundColor: vars.black03,
    borderColor: vars.black12,
    borderWidth: 1,
    marginTop: vars.spacing.small.midi2x
}; */

const thumbnailDim = vars.searchInputHeight * 2;

const previewContainerSmall = {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: thumbnailDim,
    marginRight: vars.spacing.small.maxi,
    flex: 0
};

@observer
export default class FileSharePreview extends SafeComponent {
    static popup(path, fileName) {
        console.debug(`path: ${path}, filename: ${fileName}`);
        fileState.previewFile = observable({
            path,
            fileName,
            ext: fileHelpers.getFileExtension(fileName || path).trim().toLowerCase(),
            name: fileHelpers.getFileNameWithoutExtension(fileName || path),
            // message to send with shared file
            message: '',
            // chat in which we uploading the file
            chat: chatStore.activeChat || {},
            // contact to be selected in "change recipient"
            contact: {}
        });
        return new Promise((resolve) => {
            const showPopup = () => popupState.showPopup({
                title: tx('title_uploadAndShare'),
                contents: <FileSharePreview
                    state={fileState.previewFile}
                    onSubmit={() => {
                        popupState.discardPopup();
                        const { previewFile } = fileState;
                        fileState.previewFile = null;
                        resolve(previewFile);
                    }}
                    onCancel={() => {
                        popupState.discardPopup();
                        resolve(false);
                    }}
                    onChooseRecipients={async () => {
                        await routes.modal.changeRecipient();
                        showPopup();
                    }}
                />
            });
            showPopup();
        });
    }

    @action.bound launchPreviewViewer() {
        config.FileStream.launchViewer(this.props.state.path, this.props.state.fileName);
    }

    get previewImage() {
        const width = thumbnailDim;
        const height = width;
        return (
            <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={this.launchPreviewViewer}>
                <Thumbnail path={this.props.state.path} style={{ width, height }} />
            </TouchableOpacity>
        );
    }

    recipientText(text, italicText) {
        return (
            <Text style={recipientStyle}>
                {text}
                <Text style={{ fontStyle: 'italic' }}>
                    {italicText}
                </Text>
            </Text>);
    }

    getRecipient(state) {
        const { contact, chat } = state;
        if (contact && contact.firstName) { // Share with selected User
            return this.recipientText(
                `${contact.firstName} ${contact.lastName} `,
                `@${contact.username}`
            );
        } else if (!chat.isChannel) { // Share with current User
            const user = chatStore.activeChat.otherParticipants[0];
            return this.recipientText(
                `${user.fullName} `,
                `@${user.username}`
            );
        } // Share with current Room
        return this.recipientText(
            `# ${chat.name}`
        );
    }

    renderThrow() {
        const { state } = this.props;
        const { ext } = state;
        const recipient = this.getRecipient(state);
        const fileImagePlaceholder = fileHelpers.isImage(ext)
            ? this.previewImage
            : <FileTypeIcon type={fileHelpers.getFileIconType(ext)} size="medium" />;

        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={previewContainerSmall} onLayout={this.layoutPreviewContainer}>
                        {fileImagePlaceholder}
                    </View>
                    <View style={nameContainer}>
                        <Text style={{ fontSize: vars.font.size.smaller, color: vars.txtLightGrey }}>
                            {tx('title_name')}
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={state.name}
                            onChangeText={text => { state.name = text; }}
                            underlineColorAndroid="transparent"
                            style={inputStyle} />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={this.props.onChooseRecipients}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={shareContainer}>
                    <View style={{ flexGrow: 1 }}>
                        <Text style={shareTextStyle}>
                            {tx('title_shareWith')}
                        </Text>
                        {recipient}
                    </View>
                    {icons.plaindark('keyboard-arrow-right')}
                </TouchableOpacity>
                {/* <TextInput
                    placeholder={tx('title_addMessage')}
                    onChangeText={text => { state.message = text; }}
                    value={state.message}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={vars.extraSubtleText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={false}
                    multiline
                    style={messageInputStyle}
                /> */}
                <View style={buttonContainer}>
                    <ButtonText
                        text={tx('button_cancel')}
                        onPress={this.props.onCancel}
                        secondary
                    />
                    <ButtonText
                        text={tx('button_share')}
                        onPress={this.props.onSubmit} />
                </View>
            </View>
        );
    }
}

FileSharePreview.propTypes = {
    file: PropTypes.any,
    files: PropTypes.any,
    onSubmit: PropTypes.any
};
