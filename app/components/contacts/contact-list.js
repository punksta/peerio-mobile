import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, SectionList, Text } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ContactsPlaceholder from './contacts-placeholder';
import ContactsGroups, { groupSettings } from './contacts-groups';
import ProgressOverlay from '../shared/progress-overlay';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import contactState from './contact-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import GroupsIcon from './groups-icon';
import DoneIcon from './done-icon';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactList extends SafeComponent {
    dataSource = [];
    /* 'list', 'groups' */
    @observable mode = 'list';
    @observable refreshing = false

    get groupsIcon() {
        return <GroupsIcon action={() => { this.mode = 'groups'; }} />;
    }

    get doneIcon() {
        return <DoneIcon action={() => { this.mode = 'list'; }} />;
    }

    get leftIcon() {
        return this.mode === 'list' ? this.groupsIcon : this.doneIcon;
    }

    get data() { return contactState.store.contacts; }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        contactState.store.uiViewFilter = 'all';
        this.reaction = reaction(() => [
            contactState.routerMain.route === 'contacts',
            contactState.routerMain.currentIndex === 0,
            this.data,
            this.data.length,
            contactState.store.uiView,
            contactState.store.invitedContacts,
            contactState.store.addedContacts,
            groupSettings.invited,
            groupSettings.all,
            groupSettings.favorites
        ], () => {
            // console.log(contactState.store.uiView.length);
            console.log(`contact-list.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = [];
            const { addedContacts, invitedContacts, uiView, contacts } = contactState.store;
            if (groupSettings.all) {
                this.dataSource = uiView.map(({ letter, items }) => {
                    return ({ data: items.slice(), key: letter });
                });
                this.dataSource.unshift({ data: [], key: `All (${contacts.length})` });
            }
            groupSettings.favorites &&
                this.dataSource.unshift({ data: addedContacts.slice(), key: `${tx('title_favoriteContacts')} (${addedContacts.length})` });
            groupSettings.invited &&
                this.dataSource.push({ data: invitedContacts.slice(), key: `${tx('title_invitedContacts')} (${invitedContacts.length})` });
            this.forceUpdate();
        }, true);
    }

    item({ item }) {
        return (
            <ContactItem contact={item} />
        );
    }

    header({ section: /* data, */ { key } }) {
        return <ContactSectionHeader key={key} title={key} />;
    }

    listView() {
        const { all, invited, favorites } = groupSettings;
        if (!all && !invited && !favorites) return <View><Text>{tx('title_contactGroupsNotSelected')}</Text></View>;
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username || item.email}
                renderItem={this.item}
                renderSectionHeader={this.header}
            />
        );
    }

    get rightIcon() { return this.mode === 'list' ? <PlusBorderIcon action={contactState.fabAction} /> : null; }

    get contactListComponent() {
        return !contactState.empty ?
            this.listView() : !contactState.store.loading && <ContactsPlaceholder />;
    }

    renderThrow() {
        const component = (this.mode === 'groups') ? <ContactsGroups /> : this.contactListComponent;
        return (
            <View
                style={{ flex: 1, backgroundColor: vars.lightGrayBg }}>
                <View style={{ flex: 1 }}>
                    {component}
                </View>
                <ProgressOverlay enabled={contactState.store.loading} />
            </View>
        );
    }
}

ContactList.propTypes = {
    store: PropTypes.any
};
