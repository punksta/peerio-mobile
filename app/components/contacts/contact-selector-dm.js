import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, LayoutAnimation } from 'react-native';
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
export default class ContactSelectorDM extends SafeComponent {
    @observable recipients = new ContactCollection();
    @observable inProgress = false;
    @observable clean = true;
    @observable toInvite = null;
    @observable legacyContact = null;
    @observable findUserText;

    componentDidMount() {
        this.recipients.items.observe(() => {
            // if (this.recipients.items.length && this.props.autoStart) this.action();
        });
    }

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
            margin: 4,
            padding: 0,
            paddingLeft: 12,
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
                        style={{ paddingRight: 4, marginLeft: 8 }}
                        name="cancel"
                        size={vars.iconSize}
                        color="white"
                    />
                </View>
            </TouchableOpacity>
        );
    }

    onChangeFindUserText(text) {
        console.log('onChangeFindUserText');
        this.toInvite = null;
        this.legacyContact = null;
        const items = text.split(/[ ,;]/);
        if (items.length > 1) {
            this.findUserText = items[0].trim();
            this.onSubmit();
            return;
        }
        this.findUserText = text;
        this.searchUserTimeout(text);
    }

    textbox() {
        const height = 48;
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            margin: 12,
            borderColor: vars.bg,
            borderWidth: 1,
            height,
            borderRadius: height
        };
        const label = {
            color: vars.bg,
            fontSize: 12
        };
        const style = {
            flexGrow: 1,
            height,
            marginLeft: 8,
            fontSize: 12
        };

        return (
            <View style={container}>
                <Text style={label}>To: </Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    value={this.findUserText}
                    returnKeyType="done"
                    blurOnSubmit
                    onChangeText={text => { this.clean = !text.length; this.onChangeFindUserText(text); }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={'Search by username or email'}
                    ref={ti => { this.textInput = ti; }}
                    style={style} />
                {this.findUserText ? icons.coloredSmall('close', () => {
                    this.inProgress = false;
                    this.findUserText = '';
                }, vars.bg) : null}
            </View>
        );
    }

    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16
        };
        const underlay = {
            position: 'absolute',
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'flex-end'
        };
        const textStyle = {
            fontSize: 16,
            fontWeight: vars.font.weight.semiBold,
            color: vars.txtDark
        };
        return (
            <View style={container}>
                <View style={underlay}>{icons.dark('close', this.props.onExit)}</View>
                <Center><Text style={textStyle}>{this.props.title}</Text></Center>
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

    item(contact, i) {
        const { username, fullName, isLegacy } = contact;
        return (
            <Avatar
                noBorderBottom
                starred={contact.isAdded}
                contact={contact}
                key={username || i}
                title={<Text style={{ fontWeight: 'normal' }}>{fullName}</Text>}
                title2={isLegacy ? username : null}
                height={56}
                hideOnline
                onPress={() => {
                    this.props.onExit();
                    this.props.action([contact]);
                }} />
        );
    }

    searchUserTimeout(username) {
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        if (!username) return;
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
        if (!this.findUserText) return;
        this.inProgress = true;
        when(() => !c.loading, () => {
            this.inProgress = false;
            if (!this.findUserText) return;
            if (c.notFound) {
                if (c.isLegacy) {
                    this.legacyContact = c;
                    return;
                }
                if (username.indexOf('@') !== -1) {
                    this.toInvite = username;
                }
            }
        });
    }

    body() {
        if (contactState.empty && this.clean) return <ContactsPlaceholder />;
        const found = contactState.getFiltered(this.findUserText);
        const mockItems = found.map((item, i) => this.item(item, i));
        const activityIndicator = <ActivityIndicator style={{ marginTop: 10 }} />;
        const allYourContactsTitle = found.length && !this.findUserText ?
            <Text style={{ fontWeight: 'bold', margin: 10 }}>All your contacts ({found.length})</Text> : null;
        // const result = findUserText && findUserText.length ? mockItems : chat;
        const result = mockItems;
        const body = !this.toInvite && !found.length && contactState.loading || this.inProgress ? activityIndicator : result;
        const invite = this.inviteContactDuck;
        const inviteControl = invite ? <ContactInviteItem noBorderBottom contact={invite} /> : null;
        const legacy = this.legacyContact;
        const legacyControl = legacy ? <ContactLegacyItem noBorderBottom contact={legacy} /> : null;
        return (
            <View style={{ marginHorizontal: 12 }}>
                {allYourContactsTitle}
                {inviteControl}
                {legacyControl}
                {body}
            </View>
        );
    }

    header() {
        return (
            <View style={{ paddingTop: vars.statusBarHeight * 2 }}>
                {this.exitRow()}
                {this.textbox()}
            </View>
        );
    }

    renderThrow() {
        const header = this.header();
        const body = this.body();
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
                body={body}
                header={header}
                noFitHeight
                footerAbsolute={snackbar}
                style={layoutStyle} />
        );
    }
}

ContactSelectorDM.propTypes = {
    topRow: PropTypes.any,
    title: PropTypes.any,
    action: PropTypes.func,
    onExit: PropTypes.func
};
