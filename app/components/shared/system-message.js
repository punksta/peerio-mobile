import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import VideoCallMessage from './video-call-message';
import { systemMessages } from '../../lib/icebear';

const lastMessageTextStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    color: vars.txtMedium,
    fontSize: vars.font.size.normal,
    lineHeight: 22,
    borderWidth: 0,
    borderColor: 'green'
};

@observer
export default class SystemMessage extends SafeComponent {
    renderThrow() {
        const { message } = this.props;
        if (!message.systemData) return null;

        const systemMessage = systemMessages.getSystemMessageText(message);
        const videoCallMessage = message.systemData.link;


        if (videoCallMessage) {
            return (
                <VideoCallMessage
                    videoCallMessage={videoCallMessage}
                    systemMessage={systemMessage} />
            );
        }

        if (systemMessage) {
            return (
                <Text italic style={lastMessageTextStyle}>
                    {systemMessage}
                </Text>
            );
        }

        return null;
    }
}

SystemMessage.propTypes = {
    message: PropTypes.any
};
