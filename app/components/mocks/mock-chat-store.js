import { observable, computed } from 'mobx';
import randomWords from 'random-words';
import capitalize from 'capitalize';
import mockContactStore from './mock-contact-store';
import mockFileStore from './mock-file-store';
import { popupCancelConfirm } from '../shared/popups';
import { TinyDb } from '../../lib/icebear';

const channelPaywallTitle = `2 Channels`;
const channelPaywallMessage =
`Peerio's basic account gets you access to 2 free channels.
If you would like to join or create another channel, please delete an existing one or check out our upgrade plans`;

const randomImages = [
    'https://i.ytimg.com/vi/xC5n8f0fTeE/maxresdefault.jpg',
    'http://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/1487095116/forest-park-portland-oregon-FORESTBATH0217.jpg?itok=XVmUfPQB',
    'http://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/1487095116/yakushima-forest-japan-FORESTBATH0217.jpg?itok=mnXAvDq3',
    'http://25.media.tumblr.com/865fb0f33ebdde6360be8576ad6b1978/tumblr_n08zcnLOEf1t8zamio1_250.png',
    'http://globalforestlink.com/wp-content/uploads/2015/07/coniferous.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Grand_Anse_Beach_Grenada.jpg/1200px-Grand_Anse_Beach_Grenada.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5RzVGnDGecjd0b7YqxzvkkRo-6jiraf9FOMQAgChfa4WKD_6c',
    'http://www.myjerseyshore.com/wp-content/themes/directorypress/thumbs//Beaches-Page-Picture.jpg',
    'http://www.shoreexcursionsgroup.com/img/article/region_bermuda2.jpg'
];

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
    @observable loaded = true;
    @observable unreadCount = 0;

    get allJoinedParticipants() { return this.participants; }
    get otherParticipants() { return this.participants; }


    constructor() {
        TinyDb.userCollection = TinyDb.open('testuser');
        for (let i = 0; i < 8; ++i) this.participants.push(mockContactStore.createMock());
        this.id = randomWords({ min: 7, max: 7, join: ':' });
        this.addAdmin(this.participants[0]);
        this.addAdmin(this.participants[1]);

        for (let i = 0; i < 10; ++i) {
            this.addInlineImageMessage();
            // this.addRandomMessage();
        }
        // this.addInlineImageMessage();
        // this.addExternalUrlMessage();
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

    createMock(message) {
        const id = randomWords({ min: 1, max: 4, join: '-' });
        let text = message;
        if (!message && message !== false) text = randomWords({ min: 1, max: 4, join: ' ' });
        const sender = this.participants[0];
        const groupWithPrevious = Math.random() > 0.5;
        return { id, text, sender, groupWithPrevious };
    }

    addRandomMessage(message) {
        const m = this.createMock(message);
        this.messages.push(m);
    }

    addInlineImageMessage() {
        const m = this.createMock(false);
        const name = `${randomWords({ min: 8, max: 12, join: '_' })}.png`;
        const url = randomImages.random();
        m.hasUrls = true;
        m.externalImages = [{ url, name, oversized: true /* , fileId: 1 */ }];
        this.messages.push(m);
    }

    addExternalUrlMessage() {
        const m = this.createMock('https://eslint.org/docs/rules/operator-assignment');
        const name = `${randomWords({ min: 1, max: 2, join: '_' })}.png`;
        const title = capitalize(randomWords({ min: 3, max: 5, join: ' ' }));
        const description = capitalize(randomWords({ min: 5, max: 10, join: ' ' }));
        const url = randomImages.random();
        m.inlineImage = { url, name, title, description, isLocal: false };
        this.messages.push(m);
    }

    addFileMessage() {
        const m = this.createMock(false);
        m.files = [mockFileStore.files[0].id];
        this.messages.push(m);
    }

    async addInlineImageMessageFromFile(path) {
        const m = this.createMock(false);
        const name = `${randomWords({ min: 1, max: 2, join: '_' })}.png`;
        const url = path;
        m.inlineImage = { url, name, isLocal: true };
        this.messages.push(m);
    }

    get uploadQueue() {
        const f = mockFileStore.files[0];
        f.uploading = true;
        return [f];
    }
}

class MockChat extends MockChannel {
    @observable isChannel = false;
}

class MockChatStore {
    @observable chats = [];
    @observable invites = [];
    @observable loaded = true;
    @computed get channels() {
        return this.chats.filter(chat => chat.isChannel);
    }

    constructor() {
        for (let i = 0; i < 5; ++i) {
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
        return new MockChat();
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
