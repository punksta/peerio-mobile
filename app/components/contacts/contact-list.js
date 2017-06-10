import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, SectionList } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ContactsPlaceholder from './contacts-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import contactState from './contact-state';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactList extends SafeComponent {
    dataSource = [];
    @observable refreshing = false

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
            contactState.store.uiView
        ], () => {
            console.log(contactState.store.uiView.length);
            console.log(`contact-list.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = contactState.store.uiView.map(({ letter, items }) => {
                console.log(letter);
                return ({ data: items.slice(), key: letter });
            });
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
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username}
                renderItem={this.item}
                renderSectionHeader={this.header}
                ref={sv => (this.scrollView = sv)}
            />
        );
    }

    get isFabVisible() { return true; }

    renderThrow() {
        const body = !contactState.empty ?
            this.listView() : !contactState.store.loading && <ContactsPlaceholder />;

        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {body}
                </View>
                <ProgressOverlay enabled={contactState.store.loading} />
            </View>
        );
    }
}

ContactList.propTypes = {
    store: PropTypes.any
};
