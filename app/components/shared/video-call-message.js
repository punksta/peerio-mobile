import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import { View, TouchableOpacity, Linking } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

const videoCallMsgStyle = {
    color: vars.black38,
    fontSize: vars.font.size.normal,
    lineHeight: 22,
    borderWidth: 0
};

const linkStyle = {
    color: '#2F80ED'
};

const containerStyle = {
    flex: 1,
    flexDirection: 'row'
};

@observer
export default class VideoCallMessage extends SafeComponent {
    @action.bound onPress() {
        const { videoCallMessage } = this.props;
        return Linking.openURL(videoCallMessage);
    }

    renderThrow() {
        const { systemMessage, videoCallMessage } = this.props;
        const videoCallShort = videoCallMessage.replace(/(https:\/\/)/, '');
        return (
            <View>
                <View style={containerStyle}>
                    <Text style={videoCallMsgStyle}>
                        {systemMessage}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={this.onPress}
                    pressRetentionOffset={vars.pressRetentionOffset}>
                    <View style={containerStyle}>
                        {icons.plaindark('videocam', vars.iconSizeSmall)}
                        <Text style={linkStyle}>
                            {videoCallShort}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

VideoCallMessage.propTypes = {
    videoCallMessage: PropTypes.any,
    systemMessage: PropTypes.any
};
