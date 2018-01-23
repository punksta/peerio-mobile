import PropTypes from 'prop-types';
import React from 'react';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import FileProgress from './file-progress';

const outer = {
    padding: 8,
    borderColor: vars.lightGrayBg,
    borderWidth: 1,
    marginVertical: 4,
    borderRadius: 2
};

const titleText = {
    color: vars.bg,
    marginVertical: 2,
    ellipsizeMode: 'tail'
};

const descText = {
    color: vars.txtDark,
    marginBottom: 2
};

const text = {
    flexGrow: 1,
    flexShrink: 1,
    fontWeight: 'bold',
    color: vars.txtMedium,
    textAlignVertical: 'top',
    lineHeight: 25
};

export default class FileInlineContainer extends SafeComponent {
    render() {
        const { file, isImage, isOpen, extraActionIcon } = this.props;
        const { title, description, fileId, downloading } = file;
        const isLocal = !!fileId;
        const header = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: isOpen ? 10 : 0
        };
        const name = isImage ? file.name : `${file.name} (${file.sizeFormatted})`;
        return (
            <View style={outer} {...this.props}>
                <View>
                    {!!title && <Text style={titleText}>{title}</Text>}
                    {!!description && <Text style={descText}>{description}</Text>}
                </View>
                <View style={[header, { marginBottom: !isImage && downloading ? 4 : 0 }]}>
                    {!!name && <Text numberOfLines={1} ellipsizeMode="tail" style={text}>{name}</Text>}
                    {isLocal && <View style={{ flexDirection: 'row' }}>
                        {extraActionIcon}
                        {!downloading && icons.darkNoPadding(
                            'more-vert',
                            () => this.props.onAction(file),
                            { marginHorizontal: vars.spacing.small.maxi2x }
                        )}
                    </View>}
                </View>
                {this.props.children}
            </View>
        );
    }
}

FileInlineContainer.propTypes = {
    file: PropTypes.any,
    onLayout: PropTypes.any,
    extraActionIcon: PropTypes.any,
    onAction: PropTypes.any,
    isImage: PropTypes.bool,
    isOpen: PropTypes.bool
};
