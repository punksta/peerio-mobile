import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import branding from '../../styles/branding';
import { t } from '../utils/translator';
import Text from '../controls/custom-text';

const { bgGradient } = branding;

@observer
export default class SharedFolderRemovalNotif extends SafeComponent {
    // TODO: Wire up
    dismiss() {
        console.log('Dismissed');
    }

    renderThrow() {
        const { folder } = this.props; // can be replaced with folderId
        const greenWarningLine = {
            height: 4,
            backgroundColor: bgGradient
        };
        const textContainer = {
            height: vars.folderRemoveNotifHeight,
            backgroundColor: vars.folderRemoveNotifBg,
            flexDirection: 'row',
            alignItems: 'center'
        };
        const textStyle = {
            color: vars.subtleText,
            fontSize: vars.font.size.normal,
            width: vars.largeInputWidth,
            padding: vars.spacing.small.midi2x
        };
        return (
            <View style={{ marginHorizontal: vars.spacing.medium.mini2x }}>
                <View style={greenWarningLine} />
                <View style={textContainer} >
                    <Text style={textStyle}>
                        {t('title_removedFromFolder', { folderName: folder.folderName })}
                    </Text>
                    {buttons.blueTextButton('button_dismiss', this.dismiss)}
                </View>
            </View>
        );
    }
}

SharedFolderRemovalNotif.propTypes = {
    folder: PropTypes.any.isRequired // can be replaced with folderId
};
