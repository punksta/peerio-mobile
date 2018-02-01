import PropTypes from 'prop-types';
import React from 'react';
import { Image, View } from 'react-native';

export default class FileTypeIcon extends React.Component {
    /* props
        size: small, medium, large
        type: img, audio, video, txt, zip, pdf, ai, psd, word, xls, ppt, other
    */

    render() {
        const iconSource = this.getIconSource();
        let sizeStyle;
        switch (this.props.size) {
            case 'small':
                sizeStyle = { height: 24, width: 24 };
                break;
            case 'medium':
                sizeStyle = { height: 48, width: 48 };
                break;
            case 'large': default:
                sizeStyle = { height: 72, width: 72 };
                break;
        }
        return (
            <View style={sizeStyle}>
                <Image
                    style={sizeStyle}
                    source={iconSource}
                />
            </View>
        );
    }

    getIconSource() {
        const fileType = this.props.type;
        let iconSource;
        switch (fileType) {
            case 'img':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-img-160dp.png');
                break;
            case 'audio':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-audio-160dp.png');
                break;
            case 'video':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-video-160dp.png');
                break;
            case 'txt':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-txt-160dp.png');
                break;
            case 'zip':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-zip-160dp.png');
                break;
            case 'pdf':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-pdf-160dp.png');
                break;
            case 'ai':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-ai-160dp.png');
                break;
            case 'psd':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-psd-160dp.png');
                break;
            case 'word':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-word-160dp.png');
                break;
            case 'xls':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-xls-160dp.png');
                break;
            case 'ppt':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-ppt-160dp.png');
                break;
            case 'other':
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-other-160dp.png');
                break;
            default:
                iconSource = require('../../assets/file_icons/detail_view/ic-mobile-file-other-160dp.png');
                break;
        }
        return iconSource;
    }
}

FileTypeIcon.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string
};
