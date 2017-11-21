import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, SectionList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { when, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { t, tx } from '../utils/translator';
import Layout1 from '../layout/layout1';
import Bottom from '../controls/bottom';
import SnackBar from '../snackbars/snackbar';
import Avatar from '../shared/avatar';
import ContactsPlaceholder from './contacts-placeholder';
import ContactInviteItem from './contact-invite-item';
import ContactInviteItemPrompt from './contact-invite-item-prompt';
import ContactLegacyItem from './contact-legacy-item';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import contactState from './contact-state';
import ContactCollection from './contact-collection';

const INITIAL_LIST_SIZE = 10;

function fromEmail(email) {
    return observable({ fullName: email, username: '', invited: null, email });
}

@observer
export default class ContactSelectorDM extends SafeComponent {
    @observable recipients = new ContactCollection();
    @observable inProgress = false;
    @observable clean = true;
    @observable toInvite = null;
    @observable legacyContact = null;
    @observable notFound = null;
    @observable findUserText;
    dataSource = [];

    get inviteContact() {
        if (!this.toInvite) return null;
        const result = fromEmail(this.toInvite);
        result.invited = !!contactState.store.invitedContacts.find(i => i.email === result.email);
        return result && <ContactInviteItemPrompt email={this.toInvite} />;
    }

    onChangeFindUserText(text) {
        this.toInvite = null;
        this.legacyContact = null;
        this.notFound = null;
        this.inProgress = false;
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
            paddingHorizontal: vars.spacing.small.maxi2x,
            margin: vars.spacing.small.maxi2x,
            borderColor: vars.bg,
            borderWidth: 1,
            height,
            borderRadius: height
        };
        const label = {
            color: vars.bg,
            fontSize: vars.font.size.smaller
        };
        const style = {
            flexGrow: 1,
            height,
            marginLeft: vars.spacing.small.midi2x,
            fontSize: vars.font.size.smaller
        };

        let rightIcon = null;
        if (this.findUserText) {
            rightIcon = icons.coloredSmall('close', () => {
                this.findUserText = '';
                this.onChangeFindUserText('');
            }, vars.bg);
        }

        if (this.inProgress || contactState.inProgress) {
            rightIcon = <ActivityIndicator style={{ marginRight: vars.spacing.small.midi2x }} />;
        }

        return (
            <View style={container}>
                <Text style={label}>{tx('title_to')}</Text>
                <TextInput
                    underlineColorAndroid="transparent"
                    value={this.findUserText}
                    returnKeyType="done"
                    blurOnSubmit
                    onChangeText={text => { this.clean = !text.length; this.onChangeFindUserText(text); }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={tx('title_searchByUsernameOrEmail')}
                    ref={ti => { this.textInput = ti; }}
                    style={style} />
                {rightIcon}
            </View>
        );
    }

    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            padding: vars.spacing.small.midi2x,
            alignItems: 'center'
        };
        const textStyle = {
            marginRight: vars.iconSize * 2,
            textAlign: 'center',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: vars.font.size.big,
            fontWeight: vars.font.weight.semiBold,
            color: vars.txtDark
        };
        return (
            <View style={container}>
                {icons.dark('close', this.props.onExit)}
                <Text style={textStyle}>{this.props.title}</Text>
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

    sectionHeader({ section: { data, key } }) {
        if (!data || !data.length) return null;
        const s = { fontWeight: 'bold', margin: vars.spacing.small.maxi };
        return (
            <Text style={s}>
                {tx(key, { found: data && data.length })}
            </Text>
        );
    }

    item = (params) => {
        const { item } = params;
        const { username, fullName, isLegacy, isAdded, email } = item;
        if (!username) return <ContactInviteItem noBorderBottom contact={fromEmail(email)} />;
        return (
            <Avatar
                noBorderBottom
                starred={isAdded}
                contact={item}
                title={<Text style={{ fontWeight: 'normal' }}>{fullName || username}</Text>}
                title2={isLegacy ? username : null}
                height={56}
                hideOnline
                onPress={() => {
                    this.props.onExit();
                    this.props.action([item]);
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

    searchUser(username) {
        this.inProgress = false;
        const u = username.trim();
        if (!u) return;
        const c = contactState.store.getContact(u);
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
                } else {
                    this.notFound = username;
                }
            }
        });
    }

    get listView() {
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username || item.email}
                renderItem={this.item}
                renderSectionHeader={this.sectionHeader}
            />
        );
    }

    get dataSource() {
        const result = [
            { data: contactState.getFiltered(this.findUserText).slice(), key: 'title_allYourContacts' }
        ];
        if (!this.findUserText) {
            result.push({ data: contactState.store.invitedContacts.slice(), key: 'title_allYourInvited' });
        }
        return result;
    }

    body() {
        if (contactState.empty && this.clean) return <ContactsPlaceholder />;
        const notFound = !this.inProgress && !!this.notFound && (
            <View style={{ flexDirection: 'row', marginHorizontal: vars.spacing.large.midi2x, marginVertical: vars.spacing.small.maxi }}>
                <Icon name="help-outline" size={24} color={vars.txtDate} style={{ marginRight: vars.spacing.small.midi2x }} />
                <Text style={{ color: vars.txtDate }}>{t('error_userNotFoundTryEmail', { user: this.notFound })}</Text>
            </View>
        );
        return (
            <View style={{ marginHorizontal: vars.spacing.small.maxi2x }}>
                {notFound}
                {this.inviteContact}
                {!!this.legacyContact &&
                    <ContactLegacyItem noBorderBottom contact={this.legacyContact} />}
                {this.listView}
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
