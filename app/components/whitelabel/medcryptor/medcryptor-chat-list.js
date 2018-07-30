import React from 'react';
import { observer } from 'mobx-react/native';
import medcryptorChatState from './medcryptor-chat-state';
import MedcryptorSpaceListItem from './medcryptor-space-list-item';
import MedcryptorChatZeroStatePlaceholder from './medcryptor-chat-zero-state-placeholder';
import ChatList from '../../../components/messaging/chat-list';

@observer
export default class MedCryptorChatList extends ChatList {
    get dataSource() {
        return [
            { title: 'title_channels', index: 0, data: medcryptorChatState.store.nonSpaceRooms },
            { title: 'mcr_title_patientFiles', index: 1, data: medcryptorChatState.store.spaces.spacesList },
            { title: 'title_directMessages', index: 2, data: this.secondSectionItems }
        ];
    }

    get sectionTitles() {
        return ['title_channels', 'mcr_title_patientFiles', 'title_directMessages'];
    }

    zeroStatePlaceholder() {
        return <MedcryptorChatZeroStatePlaceholder />;
    }

    spaceItem = (chat) => {
        return <MedcryptorSpaceListItem space={chat} />;
    };

    keyExtractor(item) {
        return item.kegDbId || item.id || item.title || item.spaceId;
    }

    renderChatItem = (chat) => {
        if (chat.kegDbId) return this.inviteItem(chat);
        if (chat.spaceName) return this.spaceItem(chat);
        if (chat.isChannel) return this.channelItem(chat);

        return this.dmItem(chat);
    };
}
