import React, { Component } from 'react';
import ContactSelector from '../contacts/contact-selector';
import { t, tx } from '../utils/translator';
import chatState from '../messaging/chat-state';
import fileState from './file-state';

export default class FileChooseRecipient extends Component {
    render() {
        return (
            <ContactSelector
                limit={1}
                onExit={() => chatState.routerModal.discard()}
                action={contacts => {
                    fileState.previewFile.recipient = contacts;
                }}
                title={t('title_shareWith')}
                inputPlaceholder={tx('title_TryUsernameOrEmail')} />
        );
    }
}
