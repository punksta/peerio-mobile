import { DeviceEventEmitter } from 'react-native';
import { observable, action, when } from 'mobx';
import RNContacts from 'react-native-contacts';
import RoutedState from '../routes/routed-state';
import { contactStore } from '../../lib/icebear';
import { tx } from '../utils/translator';
import fileState from '../files/file-state';
import chatState from '../messaging/chat-state';

class ContactState extends RoutedState {
    _prefix = 'contacts';
    store = contactStore;
    _permissionHandler = null;

    @action async init() {
        return new Promise(resolve => when(() => !this.store.loading, resolve));
    }

    composeMessage() {
        this.routerModal.compose();
    }

    shareFile() {
        this.routerModal.shareFileTo();
    }

    @action exit() {
        this.routerModal.discard();
        this.clear();
    }

    @observable currentContact = null;
    @observable findUserText = process.env.PEERIO_SEARCH_USERNAME || '';
    @observable loading = false;
    @observable found = [];
    @observable recipients = [];
    @observable recipientsMap = observable.shallowMap();


    @action contactView(contact) {
        this.routerMain.resetMenus();
        this.currentContact = contact;
        this.routerModal.contactView();
    }

    findByUsername(username) {
        return this.recipients.filter(i => i.username === username);
    }

    exists(c) {
        return !!this.findByUsername(c.username).length;
    }

    get filtered() {
        const result = contactStore.filter(this.findUserText);
        return result.length ? result : this.found.filter(c => !c.loading && !c.notFound);
    }

    @action add(c) {
        if (this.exists(c)) return;
        this.findUserText = '';
        this.recipients.push(c);
        this.recipientsMap.set(c.username, c);
    }

    @action remove(c) {
        const existing = this.findByUsername(c.username);
        existing.forEach(e => {
            const i = this.recipients.indexOf(e);
            if (i === -1) return;
            this.recipients.splice(i, 1);
        });
        this.recipientsMap.delete(c.username);
    }

    @action toggle(c) {
        this.exists(c) ? this.remove(c) : this.add(c);
    }

    @action clear() {
        this.loading = false;
        this.findUserText = '';
        this.recipients = [];
        this.found = [];
        this.recipientsMap.clear();
    }

    @action send(text, recipient) {
        const chat = chatState.store.startChat(recipient ? [recipient] : this.recipients);
        this.exit();
        chatState.loading = true;
        when(() => !chat.loadingMeta, () => {
            chatState.loading = false;
            this.routerMain.chats(chat, true);
            text && chat.sendMessage(text);
        });
    }

    @action sendTo(contact) {
        this.send(null, contact);
    }

    @action share() {
        if (!fileState.currentFile) return;
        const file = fileState.currentFile;
        this.recipients.forEach(username => file.share(username));
        this.exit();
    }

    get title() {
        if (this.routerMain.currentIndex === 0) return tx('title_contacts');
        return this.currentContact ? this.currentContact.username : '';
    }

    // if we have no contacts except User.current
    get empty() {
        return !this.store.contacts || (this.store.contacts.length <= 1);
    }

    @action requestPermission() {
        console.log('contact-state.js: requesting permissions');
        return new Promise(resolve => RNContacts.requestPermission((err, permission) => {
            if (err) {
                console.error(err);
                resolve('denied');
                return;
            }
            resolve(permission);
        }));
    }

    @action hasPermissions() {
        return new Promise(resolve => {
            console.log('contact-state.js: checking permissions');
            RNContacts.checkPermission((err, permission) => {
                console.log(`contact-state.js: permissions are: ${permission}`);
                // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
                if (err) {
                    console.error(err);
                    resolve('denied');
                    return;
                }
                if (permission === 'requested') {
                    this.createPermissionHandler(resolve);
                    return;
                }
                if (permission !== 'authorized') {
                    resolve(this.requestPermission());
                    return;
                }
                resolve(permission);
            });
        }).then(permission => {
            if (permission === 'authorized') {
                console.log('contact-state.js: authorized');
                return true;
            }
            if (permission === 'denied') {
                console.log('contact-state.js: denied');
            }
            return false;
        });
    }

    @action createPermissionHandler(resolve) {
        this.resolvePermissionHandler(false);
        this._permissionHandler = data => resolve(data ? 'authorized' : 'denied');
    }

    @action resolvePermissionHandler(data) {
        if (this._permissionHandler) {
            this._permissionHandler(data);
            this._permissionHandler = null;
        }
    }

    @action getContacts() {
        return new Promise(resolve => RNContacts.getAllWithoutPhotos((err, contacts) => {
            if (err) {
                console.error(err);
                resolve([]);
                return;
            }
            resolve(contacts);
        }));
    }

    @action async testImport() {
        const hasPermissions = await this.hasPermissions();
        if (!hasPermissions) return;
        const contacts = await this.getContacts();
        contacts.forEach(({ givenName, familyName, phoneNumbers }) => {
            console.log(`${givenName} ${familyName}`);
            console.log(JSON.stringify(phoneNumbers));
        });
    }

    onTransition(active, contact) {
        console.log('contacts on transition');
        this.currentContact = active ? contact : null;
    }

    fabAction() {
        console.log(`contact-state.js: fab action`);
        this.routerMain.contactAdd();
    }
}

const contactState = new ContactState();

// for android granting permissions
DeviceEventEmitter.addListener('ContactPermissionsGranted', data => {
    console.log(`contact-state.js: permissions result ${data}`);
    contactState.resolvePermissionHandler(data);
});


export default contactState;
