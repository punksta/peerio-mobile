import { observable } from 'mobx';
import randomWords from 'random-words';
import mockContactStore from './mock-contact-store';


class MockChatStore {
    @observable chats = [];
    @observable invites = [];
    @observable loaded = true;

    constructor() {
        for (let i = 0; i < 15; ++i) {
            this.chats.push(this.createMock());
        }
        for (let i = 0; i < 2; ++i) {
            this.chats.push(this.createMockChannel());
        }
        for (let i = 0; i < 4; ++i) {
            this.invites.push(this.createInvite());
        }
    }

    createMock() {
        return observable({
            title: randomWords({ min: 3, max: 5, join: ' ' }),
            participants: [mockContactStore.createMock()]
        });
    }

    createMockChannel() {
        return observable({
            isChannel: true,
            title: randomWords({ min: 1, max: 4, join: '-' }),
            participants: [mockContactStore.createMock()]
        });
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
