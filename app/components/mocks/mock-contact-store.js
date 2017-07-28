import randomWords from 'random-words';
import capitalize from 'capitalize';

function createMockContact(username) {
    return {
        username,
        firstName: 'First',
        lastName: 'Last',
        fullName: 'First Last'
    };
}

const sampleSet = [
    createMockContact('seavan'),
    createMockContact('floh'),
    createMockContact('anri'),
    createMockContact('seavan'),
    createMockContact('oscar'),
    createMockContact('delhi'),
    createMockContact('paul'),
    createMockContact('saumya'),
    createMockContact('arthur'),
    createMockContact('armen'),
    createMockContact('ruben'),
    createMockContact('zaragoz'),
    createMockContact('eren'),
    createMockContact('skylar')
];

class MockContactStore {
    addedContacts = [];
    invitedContacts = [];
    contacts = sampleSet;

    constructor() {
        for (let i = 0; i < 15; ++i) {
            this.contacts.push(this.createMock());
        }
    }

    filter() {
        return sampleSet;
    }

    createMock() {
        const username = `un_${randomWords()}`;
        const firstName = capitalize(randomWords());
        const lastName = capitalize(randomWords());
        return {
            username,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`
        };
    }
}

export default new MockContactStore();
