import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TextInput, Platform } from 'react-native';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import FileTypeIcon from '../files/file-type-icon';
import icons from '../helpers/icons';
import SafeComponent from '../shared/safe-component';
import ButtonText from '../controls/button-text';
import uiState from '../layout/ui-state';
import fileState from './file-state';

const modalStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
};

const popupNonAnimatedStyle = [modalStyle, {
    justifyContent: 'center',
    backgroundColor: '#00000020',
    transform: [{ translateY: 0 }]
}];

const wrapper = {
    flexGrow: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 10,
    margin: vars.spacing.large.mini2,
    marginHorizontal: vars.spacing.medium.mini2x,
    marginBottom: (Platform.OS === 'android' ? 0 : uiState.keyboardHeight) + vars.spacing.large.mini2,
    padding: 24
};

const container = {
    flexGrow: 1,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
        height: 1,
        width: 1
    },
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: vars.white
};

const imagePreviewStyle = {
    width: vars.imagePreviewSize,
    height: vars.imagePreviewSize
};

const title = {
    fontWeight: 'bold',
    fontSize: vars.font.size.big,
    marginBottom: vars.spacing.small.midi2x,
    color: vars.txtDark
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

// TODO Workaround negative margin
const buttonContainer = {
    flex: 0,
    marginTop: vars.spacing.large.mini,
    marginBottom: -12,
    marginRight: -12,
    flexDirection: 'row',
    justifyContent: 'flex-end'
};

export default class FileSharePreview extends SafeComponent {
    fileName;
    message;

    render() {
        const file = fileState.selectedFile;
        this.fileName = file.name;
        const fileImagePlaceholder = file.url
            ? <Image source={{ uri: file.url }} style={imagePreviewStyle} />
            : <FileTypeIcon type={file.iconType} size="medium" />;

        return (
            <View style={popupNonAnimatedStyle}>
                <View style={wrapper}>
                    <View style={container}>
                        <Text style={title}>
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
                                    this.props.onSubmit(false);
                                }}
                                secondary
                            />
                            <ButtonText
                                text={tx('button_share')}
                                onPress={() => {
                                    this.props.onSubmit({
                                        fileName: this.fileName,
                                        selectedContact: this.selectedContact, // Use Contact ID(?) instead
                                        message: this.message
                                    });
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

FileSharePreview.propTypes = {
    file: PropTypes.any,
    onSubmit: PropTypes.any
};
