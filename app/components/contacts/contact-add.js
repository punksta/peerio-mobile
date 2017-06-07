import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text, TouchableOpacity, LayoutAnimation, Share } from 'react-native';
import { observable, reaction } from 'mobx';
import ProgressOverlay from '../shared/progress-overlay';
import SafeComponent from '../shared/safe-component';
import SimpleTextBox from '../shared/simple-text-box';
import { vars } from '../../styles/styles';
import { contactStore, validation } from '../../lib/icebear';
import { tx, tu } from '../utils/translator';
import uiState from '../layout/ui-state';
import contactState from './contact-state';

const emailFormatValidator = validation.validators.emailFormat.action;

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
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

@observer
export default class ContactAdd extends SafeComponent {
    @observable waiting = false;
    @observable notFound = false;
    @observable suggestInviteEmail = '';
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

    tryAdding() {
        this.query = this.query.toLocaleLowerCase().trim();
        if (!this.query) return;
        if (this.waiting) return;
        this.waiting = true;
        this.suggestInviteEmail = '';
        this.notFound = false;
        contactStore.addContact(this.query)
            .then(found => {
                if (found) {
                    this.query = '';
                } else {
                    this.notFound = true;
                    const atInd = this.query.indexOf('@');
                    const isEmail = atInd > -1 && atInd === this.query.lastIndexOf('@');
                    if (isEmail) this.suggestInviteEmail = this.query;
                }
            })
            .finally(() => { this.waiting = false; });
        this.query = '';
    }

    share() {
        const message = 'Chat and share files securely using Peerio. https://www.peerio.com';
        const title = 'Peerio';
        const url = 'https://www.peerio.com';
        Share.share({ message, title, url });
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

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                <ScrollView
                    onScroll={this.onScroll}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1, flexGrow: 1, justifyContent: 'center' }}
                    style={{ backgroundColor: vars.settingsBg }}
                    ref={ref => (this._scrollView = ref)}>
                    <View style={{ flex: 0 }}>
                        <View style={{ margin: 8 }}>
                            <View style={buttonRow}>
                                <Text style={label}>{tx('Find your contacts')}</Text>
                                {this.renderButton1('title_importContacts', () => contactState.testImport())}
                            </View>
                        </View>
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
                        </View>
                        <View style={{ margin: 8 }}>
                            <View style={buttonRow}>
                                <Text style={label}>{tx('Invite contacts on social networks')}</Text>
                                {this.renderButton1('button_share', () => this.share())}
                            </View>
                        </View>
                        <View style={{ height: 180 }} />
                    </View>
                </ScrollView>
                <ProgressOverlay enabled={this.waiting} />
            </View>
        );
    }
}
