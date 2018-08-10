import randomWords from 'random-words';
import capitalize from 'capitalize';
import { observable } from 'mobx';

class MockContactStore {
    addedContacts = [];
    invitedContacts = [];
    invitedNotJoinedContacts = [];
    contacts = [];
    contactsMap = observable.map();

    constructor() {
        for (let i = 0; i < 15; ++i) {
            this.createMock();
        }
    }

    get uiView() {
        return [{
            letter: 'A',
            items: this.contacts
        }];
    }

    filter = (text) => {
        return text ? this.contacts.filter(c => c.username.indexOf(text) !== -1) : this.contacts;
    };

    createMock() {
        const username = `${randomWords()}${this.contacts.length}`;
        const firstName = capitalize(randomWords());
        const lastName = capitalize(randomWords());
        const contact = {
            username,
            firstName,
            lastName,
            loading: false,
            notFound: false,
            fullName: `${firstName} ${lastName}`
        };
        this.contacts.push(contact);
        this.contactsMap.set(username, contact);
        return contact;
    }

    getContact(username) {
        console.log(`get ${username}`);
        const r = this.contactsMap.get(username);
        return r || { username, loading: false, notFound: true };
    }
}

export default new MockContactStore();