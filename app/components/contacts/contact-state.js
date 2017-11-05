import { DeviceEventEmitter } from 'react-native';
import { observable, action, when } from 'mobx';
import RNContacts from 'react-native-contacts';
import RoutedState from '../routes/routed-state';
import { contactStore, warnings, User } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { loadGroupSettings } from './contacts-groups';
import contactAddState from './contact-add-state';
import chatState from '../messaging/chat-state';

class ContactState extends RoutedState {
    _prefix = 'contacts';
    @observable store = contactStore;
    _permissionHandler = null;

    @action async init() {
        await loadGroupSettings();
        return new Promise(resolve => when(() => !this.store.loading, resolve));
    }

    composeMessage() {
        this.routerModal.compose();
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

    getFiltered(findUserText, exclude = {}) {
        const result = this.store.filter(findUserText || '')
            .filter(c => c.username !== User.current.username && !exclude[c.username]);
        return result.length ? result : this.found.filter(
            c => !c.loading && !c.notFound
        );
    }

    @action sendTo(contact) {
        chatState.startChat(null, contact);
    }

    get title() {
        if (this.routerMain.currentIndex === 0) return tx('title_contacts');
        return this.currentContact ? this.currentContact.username : '';
    }

    // if we have no contacts except User.current
    get empty() {
        const { addedContacts, invitedContacts, contacts } = this.store;
        return !contacts || (contacts.length <= 1
            && !contacts.filter(u => User.current.username !== u.username).length)
            && !invitedContacts.length
            && !addedContacts.length;
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
        if (!hasPermissions) {
            warnings.add(tx('title_contactsAllowAccess'));
            return;
        }
        this.isInProgress = true;
        const contacts = await this.getContacts();
        const emails = [];
        const hash = {};
        contacts.forEach(contact => {
            const { givenName, familyName, emailAddresses } = contact;
            const display = `contact-state.js: processing ${givenName} ${familyName}`;
            console.log(display);
            if (emailAddresses) {
                emailAddresses.forEach(ea => {
                    const { email } = ea;
                    if (email) {
                        console.log(`${email}: ${givenName} ${familyName}`);
                        emails.push(email);
                        hash[email] = observable({
                            givenName,
                            familyName,
                            email,
                            username: email,
                            fullName: `${givenName} ${familyName}`,
                            color: '#EFEFEF',
                            invited: false
                        });
                    }
                });
            }
        });
        // emails = ['seavan@gmail.com'];
        this.store.importContacts(emails)
            .then(success => {
                console.log('contact-state.js: import success');
                return success;
            })
            .catch(reject => {
                return reject;
            })
            .then(data => {
                const { imported, notFound } = data;
                warnings.add(tx('title_contactsImported', { count: imported.length }));
                warnings.add(tx('title_contactsProcessed', { count: emails.length }));
                contactAddState.imported = notFound.map(email => hash[email]).filter(i => !!i);
                if (notFound.length === 0) {
                    warnings.add(`No emails found to invite`);
                    return;
                }
                this.routerMain.contactInvite();
            })
            .finally(() => {
                this.isInProgress = false;
            });
    }

    onTransition(active, contact) {
        console.log('contacts on transition');
        this.currentContact = active ? contact : null;
    }

    fabAction = () => {
        console.log(`contact-state.js: fab action`);
        this.routerMain.contactAdd();
    }
}

const contactState = new ContactState();

// for android granting permissions
DeviceEventEmitter.addListener(`ContactPermissionsGranted`, data => {
    console.log(`contact-state.js: permissions result ${data}`);
    contactState.resolvePermissionHandler(data);
});


export default contactState;
