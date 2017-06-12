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
import ProgressOverlay from '../shared/progress-overlay';
import Center from '../controls/center';
import Bottom from '../controls/bottom';
import SnackBar from '../snackbars/snackbar';
import Avatar from '../shared/avatar';
import ContactsPlaceholder from './contacts-placeholder';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import contactState from './contact-state';
import snackbarState from '../snackbars/snackbar-state';

@observer
export default class ContactSelector extends SafeComponent {
    @observable inProgress = false;
    @observable clean = true;

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
            <TouchableOpacity key={i} onPress={() => contactState.remove(contact)} >
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


    userboxline() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingLeft: 8,
            flexWrap: 'wrap'
        };
        const boxes = contactState.recipients.map((c, i) => this.userbox(c, i));

        return (
            <View style={container}>
                {boxes}
            </View>
        );
    }

    onChangeFindUserText(text) {
        const items = text.split(/[ ,;]/);
        if (items.length > 1) {
            contactState.findUserText = items[0].trim();
            this.onSubmit();
            return;
        }
        contactState.findUserText = text;
        if (text && text.trim().length > 0) {
            this.searchUserTimeout(text);
        }
    }

    onSubmit() {
        if (!contactState.findUserText && contactState.recipients.length) {
            this.action();
            return;
        }
        this.searchUser(contactState.findUserText, true);
        contactState.findUserText = '';
    }

    textbox() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1,
            marginLeft: 8
        };

        return (
            <View style={container}>
                {icons.dark('search')}
                <TextInput
                    underlineColorAndroid={'transparent'}
                    value={contactState.findUserText}
                    returnKeyType="done"
                    blurOnSubmit
                    onBlur={() => this.onSubmit()}
                    onSubmitEditing={() => this.onSubmit()}
                    onChangeText={text => { this.clean = !text.length; this.onChangeFindUserText(text) }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={tx('title_userSearch')}
                    ref={ti => (this.textInput = ti)} style={style} />
            </View>
        );
    }

    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: 14,
            fontWeight: vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', () => contactState.exit())}
                <Center style={style}><Text style={textStyle}>{this.props.title}</Text></Center>
                {contactState.recipients.length ?
                    icons.text(t('button_go'), () => this.action()) : icons.placeholder()}
            </View>
        );
    }

    send() {
        contactState.send();
    }

    async share() {
        try {
            this.inProgress = true;
            await contactState.share();
        } catch (e) {
            console.error(e);
        }
        this.inProgress = false;
    }

    action() {
        this[this.props.action]();
    }

    item(contact, i) {
        const { username, fullName } = contact;
        return (
            <Avatar
                contact={contact}
                checkbox
                checkedKey={username}
                checkedState={contactState.recipientsMap}
                key={username || i}
                title={fullName}
                message={username}
                hideOnline
                onPress={() => contactState.toggle(contact)} />
        );
    }

    searchUserTimeout(username) {
        if (this._searchTimeout) clearTimeout(this._searchTimeout);
        this._searchTimeout = setTimeout(() => this.searchUser(username), 2000);
    }

    searchUser(username, addImmediately) {
        console.log(`compose-message.js: searching for ${username}`);
        const u = username.trim();
        if (!u) return;
        const c = contactState.store.getContact(u);
        if (addImmediately) {
            contactState.add(c);
            when(() => !c.loading, () => {
                if (c.notFound) {
                    LayoutAnimation.easeInEaseOut();
                    contactState.remove(c);
                    snackbarState.pushTemporary(t('error_usernameNotFound'));
                }
            });
            return;
        }
        contactState.loading = true;
        when(() => !c.loading, () => {
            console.log(`compose-message.js: search done for ${username}, not found: ${c.notFound}`);
            contactState.loading = false;
            if (!c.notFound) {
                console.log(`compose-message.js: adding contact`);
                console.log(c);
                contactState.found = [c];
            } else {
                contactState.found = [];
            }
        });
    }

    body() {
        if (contactState.empty && this.clean) return <ContactsPlaceholder />;
        const found = contactState.filtered;
        const mockItems = found.map((item, i) => this.item(item, i));
        const activityIndicator = <ActivityIndicator style={{ marginTop: 10 }} />;
        // const result = findUserText && findUserText.length ? mockItems : chat;
        const result = mockItems;
        const body = !found.length && contactState.loading || this.inProgress ? activityIndicator : result;
        return (
            <View>
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
        const recipients = contactState.recipients;
        return (
            <View style={{ paddingTop: vars.statusBarHeight * 2 }}>
                {this.lineBlock(exitRow)}
                {/* TODO combine recipients and search */}
                {recipients.length ? this.lineBlock(userRow) : null}
                {this.lineBlock(tbSearch)}
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
                footer={snackbar}
                style={layoutStyle} />
        );
    }
}

ContactSelector.propTypes = {
    title: PropTypes.any,
    action: PropTypes.string
};
