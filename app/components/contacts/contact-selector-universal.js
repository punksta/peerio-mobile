import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, SectionList, TouchableOpacity, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { when, observable, action, reaction } from 'mobx';
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
import testLabel from '../helpers/test-label';

const INITIAL_LIST_SIZE = 10;

function fromEmail(email) {
    return observable({ fullName: email, username: '', invited: null, email });
}

@observer
export default class ContactSelectorUniversal extends SafeComponent {
    @observable recipients = new ContactCollection();
    @observable inProgress = false;
    @observable clean = true;
    @observable toInvite = null;
    @observable legacyContact = null;
    @observable notFound = null;
    @observable findUserText;
    @observable foundContact = null;

    componentDidMount() {
        this._recipientReaction = reaction(() => !!this.recipients.items.length, () => LayoutAnimation.easeInEaseOut());
    }

    componentWillUnmount() {
        this._recipientReaction();
    }

    get inviteContact() {
        if (!this.toInvite) return null;
        const result = fromEmail(this.toInvite);
        result.invited = !!contactState.store.invitedContacts.find(i => i.email === result.email);
        return result && <ContactInviteItemPrompt email={this.toInvite} />;
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

    get userboxline() {
        if (!this.props.multiselect) return null;
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: vars.spacing.small.midi2x,
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

    @action.bound onChangeFindUserText(text) {
        this.clean = !text.length;
        this.foundContact = null;
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
            paddingHorizontal: vars.spacing.small.midi,
            marginHorizontal: vars.spacing.medium.mini2x,
            marginBottom: vars.spacing.small.midi,
            borderColor: vars.bg,
            borderWidth: 1,
            height,
            borderRadius: height
        };
        const style = {
            flexGrow: 1,
            height,
            fontSize: vars.font.size.normal
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

        const leftIcon = this.props.leftIconComponent || icons.dark('search');

        return (
            <View style={container}>
                {leftIcon}
                <TextInput
                    underlineColorAndroid="transparent"
                    value={this.findUserText}
                    returnKeyType="done"
                    blurOnSubmit
                    onChangeText={this.onChangeFindUserText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={tx(this.props.inputPlaceholder)}
                    ref={ti => { this.textInput = ti; }}
                    style={style}
                    {...testLabel('textInputContactSearch')} />
                {rightIcon}
            </View>
        );
    }

    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            paddingTop: vars.spacing.small.midi2x,
            paddingHorizontal: vars.spacing.small.midi2x,
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
                <Text style={textStyle}>{tx(this.props.title)}</Text>
            </View>
        );
    }

    async action() {
        const selectorAction = this.props.action;
        if (!selectorAction) return;
        this.inProgress = true;
        await selectorAction(this.recipients.items);
        this.inProgress = false;
        this.props.onExit && this.props.onExit();
    }

    sectionHeader({ section: { data, key } }) {
        if (!data || !data.length || !key) return null;
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
                height={vars.listItemHeight}
                hideOnline
                onPress={() => {
                    if (this.props.multiselect) {
                        this.findUserText = '';
                        this.recipients.toggle(item);
                    } else {
                        this.props.onExit();
                        this.props.action([item]);
                    }
                }} />
        );
    };

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
            } else {
                this.foundContact = c;
            }
        });
    }

    get listView() {
        return (
            <SectionList
                {...testLabel('foundContacts')}
                accessible={false}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username || item.email}
                renderItem={this.item}
                renderSectionHeader={this.sectionHeader}
            />
        );
    }

    get dataSource() {
        const filteredContacts = contactState.getFiltered(this.findUserText).slice();
        const result = [
            { data: filteredContacts, key: 'title_allYourContacts' }
        ];
        if (this.foundContact) {
            result.unshift({ data: [this.foundContact], key: null });
        }
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
            <View style={{ marginHorizontal: vars.spacing.medium.maxi }}>
                {notFound}
                {this.inviteContact}
                {!!this.legacyContact &&
                    <ContactLegacyItem noBorderBottom contact={this.legacyContact} />}
                {this.listView}
            </View>
        );
    }

    header() {
        if (this.props.hideHeader) {
            return (
                <View style={{ flex: 0 }}>
                    {this.props.subTitleComponent}
                    {this.textbox()}
                    {this.userboxline}
                </View>
            );
        }
        return (
            <View style={{ paddingTop: vars.statusBarHeight * 2 }}>
                {this.exitRow()}
                {this.props.subTitleComponent}
                <View style={{ marginTop: vars.spacing.medium.mini2x }}>
                    {this.textbox()}
                </View>
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

ContactSelectorUniversal.propTypes = {
    title: PropTypes.any,
    subTitleComponent: PropTypes.any,
    leftIconComponent: PropTypes.any,
    inputPlaceholder: PropTypes.any,
    multiselect: PropTypes.any,
    action: PropTypes.func,
    onExit: PropTypes.func
};
