import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, SectionList, Text } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import ContactInviteItem from './contact-invite-item';
import ContactSectionHeader from './contact-section-header';
import contactAddState from './contact-add-state';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactListInvite extends SafeComponent {
    dataSource = [];
    get data() { return contactAddState.imported; }

    get layoutTitle() { return 'Invite contacts'; }

    get leftIcon() {
        return buttons.uppercaseWhiteButton('Done', () => contactAddState.routerMain.contacts());
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.data.length
        ], () => {
            this.dataSource = [{ data: this.data.slice(), key: 'Invite your contacts to Peerio' }];
            this.forceUpdate();
        }, true);
    }

    item({ item }) {
        return (
            <ContactInviteItem contact={item} />
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
        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {this.listView()}
                </View>
            </View>
        );
    }
}
