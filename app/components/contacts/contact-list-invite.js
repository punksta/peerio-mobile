import React from 'react';
import { observer } from 'mobx-react/native';
import { View, SectionList } from 'react-native';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import ContactInviteItem from './contact-invite-item';
import ContactSectionHeader from './contact-section-header';
import contactAddState from './contact-add-state';
import { tx } from '../utils/translator';
import ListSeparator from '../shared/list-separator';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactListInvite extends SafeComponent {
    get layoutTitle() { return tx('button_inviteEmailContact'); }

    get leftIcon() {
        return buttons.whiteTextButton(tx('button_done'), () => contactAddState.routerMain.contacts());
    }

    item({ item }) {
        return (
            <ContactInviteItem contact={item} />
        );
    }

    header({ section: /* data, */ { key } }) {
        return <ContactSectionHeader key={key} title={key} />;
    }

    get sections() {
        return [{ data: contactAddState.imported, key: tx('title_inviteToPeerio') }];
    }

    listView() {
        return (
            <SectionList
                ItemSeparatorComponent={ListSeparator}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.sections}
                keyExtractor={item => item.username}
                renderItem={this.item}
                renderSectionHeader={this.header}
                ref={sv => { this.scrollView = sv; }}
            />
        );
    }

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
