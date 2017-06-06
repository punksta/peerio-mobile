import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import SimpleTextBox from '../shared/simple-text-box';
import { vars } from '../../styles/styles';
import { validation } from '../../lib/icebear';
import { tx, tu } from '../utils/translator';
import uiState from '../layout/ui-state';

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
    @observable findContact = '';

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
                            {this.renderButton1('title_importContacts')}
                        </View>
                    </View>
                    <View style={{ margin: 8 }}>
                        <Text style={label}>{tx('Add a contact')}</Text>
                        <View style={textinputContainer}>
                            <SimpleTextBox
                                onChangeText={text => (this.findContact = text)}
                                placeholder={tx('title_userSearch')} style={textinput}
                                value={this.findContact} />
                            {this.renderButton1('button_add')}
                        </View>
                    </View>
                    <View style={{ margin: 8 }}>
                        <View style={buttonRow}>
                            <Text style={label}>{tx('Invite contacts on social networks')}</Text>
                            {this.renderButton1('button_share')}
                        </View>
                    </View>
                    <View style={{ height: 180 }} />
                </View>
            </ScrollView>
        );
    }
}
