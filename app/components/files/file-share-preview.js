import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import FileTypeIcon from '../files/file-type-icon';
import icons from '../helpers/icons';
import SafeComponent from '../shared/safe-component';
import ButtonText from '../controls/button-text';
import popupState from '../layout/popup-state';
import routes from '../routes/routes';
import fileState from './file-state';

// TODO Workaround negative margin
const buttonContainer = {
    flex: 0,
    marginTop: vars.spacing.large.mini,
    marginBottom: -12,
    marginRight: -12,
    flexDirection: 'row',
    justifyContent: 'flex-end'
};

const imagePreviewStyle = {
    width: vars.imagePreviewSize,
    height: vars.imagePreviewSize
};

const nameContainer = {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: vars.inputHeight,
    width: vars.largeInputWidth,
    paddingHorizontal: vars.spacing.small.midi2x,
    paddingTop: vars.spacing.small.mini,
    paddingBottom: vars.spacing.small.midi2x
};

// Padding 0 should be kept
const inputStyle = {
    color: vars.lighterBlackText,
    paddingVertical: 0,
    paddingLeft: 0,
    height: vars.inputHeight
};

const shareContainer = {
    marginTop: vars.spacing.medium.mini2x,
    flexDirection: 'row'
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

const messageInputStyle = {
    height: vars.inputHeightLarge,
    paddingLeft: vars.iconPadding,
    textAlignVertical: 'top',
    backgroundColor: vars.black03,
    borderColor: vars.black12,
    borderWidth: 1,
    marginTop: vars.spacing.small.midi2x
};

@observer
export default class FilePreview extends SafeComponent {
    static popup (file) {
        fileState.previewFile = observable({
            file,
            name: file.name,
            recipient: 'current'
        });
        return new Promise((resolve) => {
            const showPopup = () => popupState.showPopup({
                title: tx('title_uploadAndShare'),
                contents: <FilePreview
                    state={fileState.previewFile}
                    onSubmit={() => {
                        const { previewFile } = fileState;
                        fileState.previewFile = null;
                        resolve(previewFile);
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

    renderThrow() {
        const { state } = this.props;
        const { type, url } = state.file;
        const fileImagePlaceholder = url
            ? <Image source={{ uri: url }} style={imagePreviewStyle} />
            : <FileTypeIcon type={type} size="medium" />;

        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {fileImagePlaceholder}
                    <View style={nameContainer}>
                        <Text style={{ fontSize: vars.font.size.smaller }}>
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
                    pressRetentionOffset={vars.pressRetentionOffset} style={shareContainer}>
                    <View style={{ flexGrow: 1 }}>
                        <Text style={shareTextStyle}>
                            {tx('title_shareWith')}
                        </Text>
                        <Text style={recipientStyle}>
                            Recipient Name
                        </Text>
                    </View>
                    {icons.dark('keyboard-arrow-right')}
                </TouchableOpacity>
                <TextInput
                    placeholder={tx('title_addMessage')}
                    onChangeText={text => { this.message = text; }}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={vars.extraSubtleText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={false}
                    multiline
                    style={messageInputStyle}
                />
                <View style={buttonContainer}>
                    <ButtonText
                        text={tx('button_cancel')}
                        onPress={() => {
                            popupState.discardPopup();
                            this.props.onSubmit(false);
                        }}
                        secondary
                    />
                    <ButtonText
                        text={tx('button_share')}
                        onPress={() => {
                            popupState.discardPopup();
                            this.props.onSubmit({
                                name: this.name,
                                selectedContact: this.selectedContact, // Use Contact ID(?) instead
                                message: this.message
                            });
                        }}
                    />
                </View>
            </View>
        );
    }
}

FilePreview.propTypes = {
    file: PropTypes.any,
    files: PropTypes.any,
    onSubmit: PropTypes.any
};
