import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import contactState from '../contacts/contact-state';
import fileState from '../files/file-state';
import { systemMessages } from '../../lib/icebear';
import IdentityVerificationNotice from '../shared/identityVerificationNotice';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class ChatItem extends SafeComponent {
    setRef = ref => { this._ref = ref; };

    renderThrow() {
        if (!this.props || !this.props.message) return null;
        const i = this.props.message;
        if (!i.sender) return null;
        const key = i.id;
        const msg = i.text || '';
        const text = msg.replace(/\n[ ]+/g, '\n');
        const onPressAvatar = () => contactState.contactView(i.sender);
        const onPress = i.sendError ? this.props.onRetryCancel : null;

        // this causes double update on add message
        const error = !!i.signatureError;
        const systemMessageText =
            i.systemData && systemMessages.getSystemMessageText(i) || null;
        const files = i.files && i.files.map(id => fileState.store.getById(id)).filter(f => f) || [];
        const images = files.filter(f => f.isImage) || [];
        const normalFiles = files.filter(f => !f.isImage) || [];
        let firstImage = images.length ? images[0] : null;
        if (i.hasUrls && i.externalImages.length) {
            firstImage = i.externalImages[0];
        }
        return (
            <View>
                <Avatar
                    noTap={!i.sendError}
                    sendError={i.sendError}
                    sending={i.sending}
                    contact={i.sender}
                    isDeleted={i.sender ? i.sender.isDeleted : false}
                    files={normalFiles.map(f => f.fileId)}
                    inlineImage={firstImage}
                    receipts={i.receipts}
                    hideOnline
                    firstOfTheDay={i.firstOfTheDay}
                    timestamp={i.timestamp}
                    timestampText={i.messageTimestampText}
                    message={text}
                    isChat
                    systemMessage={systemMessageText}
                    key={key}
                    error={error}
                    onPress={onPress}
                    onPressAvatar={onPressAvatar}
                    onLayout={this.props.onLayout}
                    onRetryCancel={this.props.onRetryCancel}
                    onInlineImageAction={this.props.onInlineImageAction}
                    noBorderBottom
                    collapsed={!!i.groupWithPrevious}
                    extraPaddingTop={8}
                    ref={this.setRef}
                />
                {
                    systemMessageText === tx('title_userJoined') ?
                        (
                            <View style={{ paddingTop: vars.spacing.small.midi, paddingBottom: vars.spacing.small.midi }}>
                                <IdentityVerificationNotice />
                            </View>
                        ) :
                        null
                }
            </View>
        );
    }
}

ChatItem.propTypes = {
    onLayout: PropTypes.func,
    onPress: PropTypes.func,
    onRetryCancel: PropTypes.func,
    message: PropTypes.any.isRequired
};
