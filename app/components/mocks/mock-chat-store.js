import { observable } from 'mobx';
import randomWords from 'random-words';
import capitalize from 'capitalize';
import mockContactStore from './mock-contact-store';
import { popupCancelConfirm } from '../shared/popups';
import { TinyDb } from '../../lib/icebear';

const channelPaywallTitle = `2 Channels`;
const channelPaywallMessage =
`Peerio's basic account gets you access to 2 free channels.
If you would like to join or create another channel, please delete an existing one or check out our upgrade plans`;

class MockChannel {
    @observable messages = [];
    @observable id;
    @observable isChannel = true;
    @observable name = randomWords({ min: 1, max: 4, join: '-' });
    @observable topic = `${capitalize(randomWords({ min: 2, max: 4, join: ' ' }))}!`;
    @observable participants = [];
    @observable isFavorite = false;
    @observable isMuted = false;
    @observable adminMap = observable.map();

    constructor() {
        TinyDb.userCollection = TinyDb.open('testuser');
        for (let i = 0; i < 8; ++i) this.participants.push(mockContactStore.createMock());
        this.id = randomWords({ min: 7, max: 7, join: ':' });
        this.addAdmin(this.participants[0]);
        this.addAdmin(this.participants[1]);
    }

    toggleFavoriteState() {
        this.isFavorite = !this.isFavorite;
    }

    toggleMuted() {
        this.isMuted = !this.isMuted;
    }

    removeChannelMember(contact) {
        const i = this.participants.indexOf(contact);
        if (i !== -1) this.participants.splice(i, 1);
    }

    isAdmin(contact) {
        return this.adminMap.has(contact.username);
    }

    addAdmin(contact) {
        this.adminMap.set(contact.username, contact);
    }

    removeAdmin(contact) {
        this.adminMap.delete(contact.username);
    }

    sendInvites(contacts) {
        contacts.forEach(i => {
            if (this.participants.filter(p => p.username === i.username).length === 0) {
                this.participants.push(i);
            }
        });
    }
}

class MockChatStore {
    @observable chats = [];
    @observable invites = [];
    @observable loaded = true;

    constructor() {
        for (let i = 0; i < 2; ++i) {
            this.chats.push(this.createMockChannel());
        }

        for (let i = 0; i < 15; ++i) {
            this.chats.push(this.createMock());
        }

        for (let i = 0; i < 4; ++i) {
            this.invites.push(this.createInvite());
        }

        this.activeChat = this.chats[0];
    }

    createMock() {
        return observable({
            id: randomWords({ min: 7, max: 7, join: ':' }),
            title: randomWords({ min: 3, max: 5, join: ' ' }),
            participants: [mockContactStore.createMock()]
        });
    }

    createMockChannel() {
        return new MockChannel();
    }

    createInvite() {
        const invite = observable({
            id: randomWords({ min: 7, max: 7, join: ':' }),
            title: randomWords({ min: 1, max: 3, join: '-' }),
            invitedBy: mockContactStore.createMock()
        });

        invite.acceptInvite = () => {
            popupCancelConfirm(channelPaywallTitle, channelPaywallMessage);
        };

        invite.rejectInvite = () => {
            this.invites.splice(this.invites.indexOf(invite), 1);
        };

        return invite;
    }

    loadAllChats() {
    }
}

export default new MockChatStore();
