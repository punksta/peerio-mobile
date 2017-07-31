import { observable } from 'mobx';
import randomWords from 'random-words';
import capitalize from 'capitalize';
import mockContactStore from './mock-contact-store';

class MockChannel {
    @observable messages = [];
    @observable isChannel = true;
    @observable title = randomWords({ min: 1, max: 4, join: '-' });
    @observable topic = `${capitalize(randomWords({ min: 2, max: 4, join: ' ' }))}!`;
    @observable participants = [];
    @observable isFavorite = false;
    @observable isMuted = false;

    constructor() {
        for (let i = 0; i < 8; ++i) this.participants.push(mockContactStore.createMock());
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
            title: randomWords({ min: 3, max: 5, join: ' ' }),
            participants: [mockContactStore.createMock()]
        });
    }

    createMockChannel() {
        return new MockChannel();
    }

    createInvite() {
        return observable({
            id: randomWords({ min: 7, max: 7, join: ':' }),
            title: randomWords({ min: 1, max: 3, join: '-' }),
            invitedBy: mockContactStore.createMock()
        });
    }
}

export default new MockChatStore();
