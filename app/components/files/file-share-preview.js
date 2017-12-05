import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TextInput } from 'react-native';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import FileTypeIcon from '../files/file-type-icon';
import icons from '../helpers/icons';
import SafeComponent from '../shared/safe-component';
import ButtonText from '../controls/button-text';
import popupState from '../layout/popup-state';

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
    paddingLeft: 0
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

export default class FileSharePreview extends SafeComponent {
    fileName;
    message;

    render() {
        this.fileName = this.props.file.fileName || this.props.file[0].name;
        const fileImagePlaceholder = (this.props.file.url)
            ? <Image source={{ uri: this.props.file.url }} style={imagePreviewStyle} />
            : <FileTypeIcon type={this.props.file[0].iconType} size="medium" />;

        return (
            <View>
                <Text style={}>
                    {tx('title_uploadAndShare')}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {fileImagePlaceholder}
                    <View style={nameContainer}>
                        <Text style={{ fontSize: vars.font.size.smaller }}>
                            {tx('title_name')}
                        </Text>
                        <TextInput
                            autoCorrect={false}
                            autoCapitalize="none"
                            defaultValue={this.fileName}
                            onChangeText={text => { this.fileName = text; }}
                            underlineColorAndroid="transparent"
                            style={inputStyle} />
                    </View>
                </View>
                <View style={shareContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={shareTextStyle}>
                            {tx('title_shareWith')}
                        </Text>
                        <Text style={recipientStyle}>
                            Recipient Name
                        </Text>
                    </View>
                    {icons.dark('keyboard-arrow-right')}
                </View>
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
                                fileName: this.fileName,
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

FileSharePreview.propTypes = {
    file: PropTypes.any,
    onSubmit: PropTypes.any
};
