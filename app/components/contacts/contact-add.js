import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text, TouchableOpacity, LayoutAnimation, Share } from 'react-native';
import { observable, reaction } from 'mobx';
import ProgressOverlay from '../shared/progress-overlay';
import SafeComponent from '../shared/safe-component';
import SimpleTextBox from '../shared/simple-text-box';
import ContactInviteItem from './contact-invite-item';
import { vars } from '../../styles/styles';
import { contactStore, warnings, User, config } from '../../lib/icebear';
import { tx, tu } from '../utils/translator';
import uiState from '../layout/ui-state';
import contactState from './contact-state';
import buttons from '../helpers/buttons';

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
};

const inviteContainer = {
    marginBottom: 2,
    height: vars.inputHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    paddingLeft: vars.inputPaddingLeft
};

const buttonRow = {
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden'
};

const textinput = {
    fontSize: 14,
    height: vars.inputHeight,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1
};

const textStatic = {
    fontSize: 14,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1,
    alignSelf: 'center'
};

const label = {
    color: vars.txtDate,
    marginVertical: 4,
    marginLeft: 10
};

const labelDark = [label, { color: vars.txtDark }];

@observer
export default class ContactAdd extends SafeComponent {
    @observable waiting = false;
    @observable notFound = false;
    @observable toInvite = null;
    @observable query = '';

    componentDidMount() {
        uiState.currentScrollView = this._scrollView;
    }

    componentWillUnmount() {
        uiState.currentScrollView = null;
        uiState.currentScrollViewPosition = 0;
    }

    onScroll = ({ nativeEvent: { contentOffset: { y } } }) => {
        uiState.currentScrollViewPosition = y;
    }

    inviteContactDuck(toInvite) {
        if (!toInvite) return null;
        const email = toInvite;
        const fullName = toInvite;
        const username = '';
        const invited = false;
        return observable({ fullName, username, invited, email });
    }

    tryAdding() {
        this.query = this.query.toLocaleLowerCase().trim();
        if (!this.query) return;
        if (this.waiting) return;
        this.waiting = true;
        this.toInvite = null;
        this.notFound = false;
        contactStore.addContact(this.query)
            .then(found => {
                if (found) {
                    this.query = '';
                } else {
                    this.notFound = true;
                    const atInd = this.query.indexOf('@');
                    const isEmail = atInd > -1 && atInd === this.query.lastIndexOf('@');
                    if (isEmail) {
                        warnings.add(`User not found on Peerio, please invite`);
                        LayoutAnimation.easeInEaseOut();
                        this.toInvite = this.inviteContactDuck(this.query);
                    }
                }
            })
            .finally(() => {
                this.query = '';
                this.waiting = false;
            });
    }

    share() {
        const urls = config.translator.urlMap;
        const message = tx('title_socialShareInviteContent', {
            socialShareUrl: urls.socialShareUrl,
            username: User.current.username
        });
        const title = tx('title_socialShareInvite');
        // const url = 'https://www.peerio.com';
        console.log(title, message);
        Share.share({ message, title });
    }

    get emailButton() {
        let text = 'button_addEmail';
        if (this.showAddEmail) {
            text = this.newEmailText ? 'button_save' : 'button_cancel';
        }
        return this.renderButton1(text, () => this.emailAction(), this.newEmailText && this.showAddEmail && !this.newEmailTextValid);
    }

    get validationError() {
        if (!this.showValidationError) return null;
        return (
            <Text numberOfLines={1} ellipsizeMode="tail" style={[textStatic, { color: vars.txtAlert }]}>
                {tx('error_invalidEmail')}
            </Text>
        );
    }

    renderButton1(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingRight: 12, paddingVertical: 10 }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.bg }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

    renderText(text, style) {
        return (
            <View style={{ flexDirection: 'row', flex: 1, flexGrow: 1 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[textStatic, style]}>
                    {text}
                </Text>
            </View>
        );
    }

    get inviteBlock() {
        const mockContact = this.toInvite || {};
        const { email, invited } = mockContact;
        return (
            <View style={{ overflow: 'hidden', height: email ? undefined : 0, opacity: invited ? 0.5 : 1 }}>
                <View style={inviteContainer}>
                    <Text>{email}</Text>
                    {buttons.uppercaseBlueButton('Invite', () => {
                        mockContact.invited = true;
                        contactStore.invite(email);
                    }, invited)}
                </View>
            </View >
        );
    }

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                <ScrollView
                    onScroll={this.onScroll}
                    keyboardShouldPersistTaps="handled"
                    style={{ backgroundColor: vars.settingsBg }}
                    ref={ref => (this._scrollView = ref)}>
                    <View style={{ marginTop: 20 }}>
                        {contactState.empty && <View style={{ margin: 8 }}>
                            <Text style={labelDark}>{tx('title_contactZeroState')}</Text>
                        </View>}
                        <View style={{ margin: 8 }}>
                            <Text style={label}>{tx('Add a contact')}</Text>
                            <View style={textinputContainer}>
                                <SimpleTextBox
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    onChangeText={text => (this.query = text)}
                                    placeholder={tx('title_userSearch')} style={textinput}
                                    value={this.query} />
                                {this.renderButton1('button_add', () => this.tryAdding())}
                            </View>
                            {this.inviteBlock}
                        </View>
                        <View style={{ margin: 8 }}>
                            <View style={buttonRow}>
                                <Text style={labelDark}>{tx('Find your contacts')}</Text>
                                {this.renderButton1('title_importContacts', () => contactState.testImport())}
                            </View>
                        </View>
                        <View style={{ margin: 8 }}>
                            <View style={buttonRow}>
                                <Text style={labelDark}>{tx('Invite contacts on social networks')}</Text>
                                {this.renderButton1('button_share', () => this.share())}
                            </View>
                        </View>
                        <View style={{ height: 180 }} />
                    </View>
                </ScrollView>
                <ProgressOverlay enabled={this.waiting || contactState.isInProgress} />
            </View>
        );
    }
}
