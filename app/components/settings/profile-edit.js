import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import SimpleTextBox from '../shared/simple-text-box';
import { vars } from '../../styles/styles';
import { User, contactStore, validation } from '../../lib/icebear';
import { t, tx, tu } from '../utils/translator';
import icons from '../helpers/icons';
import uiState from '../layout/ui-state';

const emailFormatValidator = validation.validators.emailFormat.action;

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
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

const flexRow = {
    flexDirection: 'row',
    flex: 0,
    flexGrow: 1,
    alignItems: 'center'
};

const label = {
    color: vars.txtDate,
    marginVertical: 4,
    marginLeft: 10
};

const emailIcon = (
    <View style={{ marginHorizontal: 8 }}>
        {icons.plaindark('email')}
    </View>
);

@observer
export default class ProfileEdit extends SafeComponent {
    @observable firstName;
    @observable lastName;
    @observable newEmailText = null;
    @observable newEmailTextValid = null;
    @observable showAddEmail = false;

    componentDidMount() {
        const { firstName, lastName } = User.current;
        Object.assign(this, { firstName, lastName });
        uiState.currentScrollView = this._scrollView;
        reaction(() => this.newEmailText, async text => (this.newEmailTextValid = await emailFormatValidator(text)));
    }

    componentWillUnmount() {
        uiState.currentScrollView = null;
        uiState.currentScrollViewPosition = 0;
    }

    onScroll = ({ nativeEvent: { contentOffset: { y } } }) => {
        uiState.currentScrollViewPosition = y;
    }

    submit = () => {
        const user = User.current;
        const { firstName, lastName } = user;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        User.current.saveProfile().catch(() => {
            Object.assign(user, { firstName, lastName });
        });
    }

    saveLastName = (val) => {
        const prev = User.current.lastName;
        User.current.lastName = val;
        User.current.saveProfile().catch(() => {
            User.current.lastName = prev;
        });
    }

    saveNewEmail = () => {
        if (this.newEmailText && this.newEmailTextValid) User.current.addEmail(this.newEmailText);
        this.cancelNewEmail();
    };

    cancelNewEmail = () => {
        this.newEmailText = '';
        this.showAddEmail = false;
    };

    async emailAction() {
        await uiState.hideAll();
        LayoutAnimation.easeInEaseOut();
        this.showAddEmail = !this.showAddEmail;
        console.log(this.showAddEmail);
        if (this.showAddEmail) {
            this._addEmailBox.focus();
        }
        if (!this.newEmailText) {
            return;
        }
        this.saveNewEmail();
    }

    get emailButton() {
        let text = 'button_addEmail';
        if (this.showAddEmail) {
            text = this.newEmailText ? 'button_save' : 'button_cancel';
        }
        return this.renderButton1(text, () => this.emailAction(), this.newEmailText && this.showAddEmail && !this.newEmailTextValid);
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

    renderUserEmail = (item) => {
        const canDelete = User.current.addresses.length > 1;
        const { address, confirmed, primary } = item;
        const isPrimary = this.renderButton1(
            'title_primaryEmail',
            null
        );
        const resendLink = this.renderButton1(
            'button_resend',
            () => User.current.resendEmailConfirmation(address)
        );
        const primaryLink = this.renderButton1(
            'button_makePrimary',
            () => User.current.makeEmailPrimary(address)
        );
        const deleteIcon = <View>{icons.dark('delete', () => User.current.removeEmail(address))}</View>;
        return (
            <View style={textinputContainer} key={address}>
                {emailIcon}
                <View style={{ flexDirection: 'row', flex: 1, flexGrow: 1, height: vars.inputHeight }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={textStatic}>
                        {address}
                    </Text>
                </View>
                {confirmed && primary ? isPrimary : null}
                {confirmed && !primary ? primaryLink : null}
                {confirmed ? null : resendLink}
                {(!primary && canDelete) ? deleteIcon : null}
            </View>
        );
    }

    renderThrow() {
        const contact = contactStore.getContact(User.current.username);
        const { firstName, lastName, fingerprintSkylarFormatted, username } = contact;
        const user = User.current;
        return (
            <ScrollView
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: vars.settingsBg }} ref={ref => (this._scrollView = ref)}>
                <View style={[flexRow, { backgroundColor: contact.color }]}>
                    <Text style={{
                        color: vars.white,
                        fontWeight: 'bold',
                        fontSize: 60,
                        marginHorizontal: 24,
                        marginVertical: 16
                    }}>
                        {contact.letter}
                    </Text>
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: vars.white,
                                fontSize: 16,
                                marginVertical: 4
                            }}>{firstName} {lastName}</Text>
                        <Text style={{ color: vars.white }}>@{username}</Text>
                    </View>
                </View>
                <View style={{ margin: 8 }}>
                    <Text style={label}>{tx('title_name')}</Text>
                    <View style={textinputContainer}>
                        <SimpleTextBox
                            onBlur={this.submit}
                            onChangeText={text => (this.firstName = text)}
                            placeholder={tx('title_firstName')} style={textinput} value={this.firstName} />
                    </View>
                    <View style={textinputContainer}>
                        <SimpleTextBox
                            onBlur={this.submit}
                            onChangeText={text => (this.lastName = text)}
                            placeholder={tx('title_lastName')} style={textinput} value={this.lastName} />
                    </View>
                </View>
                <View style={{ margin: 8 }}>
                    <Text style={label}>{tx('title_contacts')}</Text>
                    {user.addresses.map(this.renderUserEmail)}
                    <View style={[textinputContainer, this.showAddEmail ? null : { height: 0 }]}>
                        {emailIcon}
                        <SimpleTextBox
                            key={user.addresses.length}
                            ref={ref => (this._addEmailBox = ref)}
                            placeholder={tx('title_email')}
                            keyboardType="email-address"
                            autoCorrect={false}
                            autoComplete={false}
                            autoCapitalize="none"
                            value={this.newEmailText}
                            onChangeText={text => (this.newEmailText = text)}
                            onSubmitEditing={() => this.emailAction()}
                            style={textinput} />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                        {this.emailButton}
                    </View>
                </View>
                <View style={{ margin: 18, marginTop: 8 }}>
                    <Text style={{ color: vars.txtDate, marginBottom: 6 }}>{t('title_publicKey')}</Text>
                    <Text style={{ color: vars.txtMedium, fontFamily: `Verdana`, fontSize: 16 }} numberOfLines={2}>
                        {fingerprintSkylarFormatted}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}
