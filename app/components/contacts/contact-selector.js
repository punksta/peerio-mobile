import PropTypes from 'prop-types';
import React from 'react';
import {
    View, Text, TextInput, ActivityIndicator, TouchableOpacity, LayoutAnimation
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { when, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { t, tx } from '../utils/translator';
import Layout1 from '../layout/layout1';
import Center from '../controls/center';
import Bottom from '../controls/bottom';
import SnackBar from '../snackbars/snackbar';
import Avatar from '../shared/avatar';
import ContactsPlaceholder from './contacts-placeholder';
import ContactInviteItem from './contact-invite-item';
import ContactLegacyItem from './contact-legacy-item';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import contactState from './contact-state';
import snackbarState from '../snackbars/snackbar-state';
import ContactCollection from './contact-collection';

@observer
export default class ContactSelector extends SafeComponent {
    @observable recipients = new ContactCollection();
    @observable inProgress = false;
    @observable clean = true;
    @observable toInvite = null;
    @observable legacyContact = null;
    @observable found = [];
    @observable findUserText;

    get inviteContactDuck() {
        if (!this.toInvite) return null;
        const email = this.toInvite;
        const fullName = this.toInvite;
        const username = '';
        const invited = false;
        return observable({ fullName, username, invited, email });
    }

    userbox(contact, i) {
        const style = {
            backgroundColor: vars.bg,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            margin: vars.spacing.small.mini2x,
            padding: 0,
            paddingLeft: vars.spacing.small.maxi2x,
            height: 32,
            overflow: 'hidden'
        };
        const textStyle = {
            color: 'white'
        };

        return (
            <TouchableOpacity key={i} onPress={() => this.recipients.remove(contact)} >
                <View style={style}>
                    <Text style={textStyle}>{contact.username}</Text>
                    <Icon
                        style={{ paddingRight: vars.spacing.small.mini2x, marginLeft: vars.spacing.small.midi2x }}
                        name="cancel"
                        size={vars.iconSize}
                        color="white"
                    />
                </View>
            </TouchableOpacity>
        );
    }


    userboxline() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingLeft: vars.spacing.small.midi2x,
            flexWrap: 'wrap'
        };
        const boxes = this.recipients.items.map((c, i) => this.userbox(c, i));

        return (
            <View style={container}>
                {boxes}
            </View>
        );
    }

    onChangeFindUserText(text) {
        this.toInvite = null;
        this.legacyContact = null;
        const items = text.split(/[ ,;]/);
        if (items.length > 1) {
            this.findUserText = items[0].trim();
            this.onSubmit();
            return;
        }
        this.findUserText = text;
        if (text && text.trim().length > 0) {
            this.searchUserTimeout(text);
        }
    }

    onSubmit = () => {
        if (this.toInvite) {
            this.findUserText = '';
            return;
        }

        this.searchUser(this.findUserText, true);
        if (this.props.limit !== 1) this.findUserText = '';
    }

    textbox() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1,
            marginLeft: vars.spacing.small.midi2x
        };

        return (
            <View style={container}>
                {icons.dark('search')}
                <TextInput
                    underlineColorAndroid={'transparent'}
                    value={this.findUserText}
                    onSubmitEditing={this.onSubmit}
                    returnKeyType="done"
                    onChangeText={text => { this.clean = !text.length; this.onChangeFindUserText(text); }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={tx('title_userSearch')}
                    ref={ti => { this.textInput = ti; }} style={style} />
            </View>
        );
    }

    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', this.props.onExit)}
                <Center style={style}><Text style={textStyle}>{this.props.title}</Text></Center>
                {this.recipients.items.length ?
                    icons.text(t('button_go'), () => this.action()) : icons.placeholder()}
            </View>
        );
    }

    async action() {
        const { action } = this.props;
        if (!action) return;
        this.inProgress = true;
        await action(this.recipients.items);
        this.inProgress = false;
        this.props.onExit && this.props.onExit();
    }

    toggle(contact) {
        if (this.props.limit && this.recipients.items.length >= this.props.limit) {
            this.recipients.clear();
        }
        this.findUserText = '';
        this.recipients.toggle(contact);
    }

    item(contact, i) {
        const { username, fullName } = contact;
        return (
            <Avatar
                starred={contact.isAdded}
                contact={contact}
                checkbox={this.props.limit > 1}
                checkedKey={username}
                checkedState={this.recipients.itemsMap}
                key={username || i}
                title={fullName}
                title2={username}
                height={56}
                hideOnline
                onPress={() => this.toggle(contact)} />
        );
    }

    searchUserTimeout(username) {
        if (this._searchTimeout) clearTimeout(this._searchTimeout);
        this.inProgress = true;
        this._searchTimeout = setTimeout(() => this.searchUser(username), 500);
    }

    searchUser(username, addImmediately) {
        this.inProgress = false;
        const u = username.trim();
        if (!u) return;
        const c = contactState.store.getContact(u);
        if (addImmediately) {
            this.recipients.add(c);
            when(() => !c.loading, () => {
                if (c.notFound) {
                    LayoutAnimation.easeInEaseOut();
                    this.recipients.remove(c);
                    if (c.isLegacy) {
                        snackbarState.pushTemporary(t('title_inviteLegacy'));
                        if (this._searchTimeout) {
                            clearTimeout(this._searchTimeout);
                            this._searchTimeout = null;
                        }
                        return;
                    }
                    snackbarState.pushTemporary(t('error_usernameNotFound'));
                }
            });
            return;
        }
        this.inProgress = true;
        when(() => !c.loading, () => {
            this.inProgress = false;
            if (!c.notFound) {
                console.log(`compose-message.js: adding contact`);
                this.found = [c];
            } else {
                if (c.isLegacy) {
                    this.legacyContact = c;
                    return;
                }
                if (username.indexOf('@') !== -1) {
                    this.toInvite = username;
                }
                this.found = [];
            }
        });
    }

    body() {
        if (contactState.empty && this.clean) return <ContactsPlaceholder />;
        console.log(this.props.exclude);
        const found = contactState.getFiltered(this.findUserText, this.props.exclude);
        const mockItems = found.map((item, i) => this.item(item, i));
        const activityIndicator = <ActivityIndicator style={{ marginTop: vars.spacing.small.maxi }} />;
        // const result = findUserText && findUserText.length ? mockItems : chat;
        const result = mockItems;
        const body = !this.toInvite && !found.length && contactState.loading || this.inProgress ? activityIndicator : result;
        const invite = this.inviteContactDuck;
        const inviteControl = invite ? <ContactInviteItem contact={invite} /> : null;
        const legacy = this.legacyContact;
        const legacyControl = legacy ? <ContactLegacyItem contact={legacy} /> : null;
        return (
            <View>
                {inviteControl}
                {legacyControl}
                {body}
            </View>
        );
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    header() {
        const tbSearch = this.textbox();
        const userRow = this.userboxline();
        const exitRow = this.exitRow();
        const recipients = this.recipients.items;
        return (
            <View style={{ paddingTop: this.props.hideHeader ? 0 : vars.statusBarHeight * 2 }}>
                {this.props.hideHeader ? null : this.lineBlock(exitRow)}
                {/* TODO combine recipients and search */}
                {recipients.length ? this.lineBlock(userRow) : null}
                {this.lineBlock(tbSearch)}
            </View>
        );
    }

    renderThrow() {
        const header = this.header();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        const snackbar = (
            <Bottom>
                <SnackBar />
            </Bottom>
        );
        return (
            <Layout1
                defaultBar
                body={this.body()}
                header={header}
                noFitHeight
                footerAbsolute={snackbar}
                style={layoutStyle} />
        );
    }
}

ContactSelector.propTypes = {
    topRow: PropTypes.any,
    hideHeader: PropTypes.any,
    exclude: PropTypes.any,
    title: PropTypes.any,
    action: PropTypes.func,
    onExit: PropTypes.func
};
