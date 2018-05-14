import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import CountryPickerBox from '../controls/country-picker-box';
import SpecialityPickerBox from '../controls/speciality-picker-box';
import RolePickerBox from '../controls/role-picker-box';
import Bold from '../controls/bold';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { popupTOS } from '../shared/popups';
import { t, tx, T } from '../utils/translator';
import LoginWizardPage, {
    header2, innerSmall, circleTopSmall, headingStyle2, footerText1, footerText2, innerContainer, outerContainer, buttonRowStyle
} from '../login/login-wizard-page';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';

const { validators } = validation;
const { firstName, lastName, username, email } = validators;

const formStyle = {
    paddingVertical: vars.spacing.small.midi2x,
    justifyContent: 'space-between'
};

const footer = {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center'
};

const tosParser = {
    emphasis: text => <Bold>{text}</Bold>,
    tosButton: text => (
        <Text
            onPress={popupTOS}
            style={[footerText2, { textDecorationLine: 'underline' }]}>
            {text}
        </Text>
    )
};

const signupTextStyle = [footerText1, { fontSize: vars.font.size.smaller }];

@observer
export default class SignupStepMedical extends LoginWizardPage {
    firstnameState = observable({ value: '' });
    lastnameState = observable({ value: '' });
    usernameState = observable({ value: '' });
    emailState = observable({ value: '' });

    @action.bound firstNameInputRef(ref) { this.firstNameInput = ref; }
    @action.bound lastNameInputRef(ref) { this.lastNameInput = ref; }
    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }
    @action.bound emailInputRef(ref) { this.emailInput = ref; }

    @action.bound onSubmitFirstName() { this.lastNameInput.onFocus(); }
    @action.bound onSubmitLastName() { this.usernameInput.onFocus(); }
    @action.bound onSubmitUsername() { this.emailInput.onFocus(); }

    @action.bound handleNextButton() {
        signupState.firstName = this.firstnameState.value;
        signupState.lastName = this.lastnameState.value;
        signupState.username = this.usernameState.value;
        signupState.email = this.emailState.value;
        signupState.next();
    }

    get isNextDisabled() {
        // removing "!this.firstnameState.value" causes a runtime error
        return socket.connected && (!this.firstnameState.value || !this.firstNameInput.isValid ||
            !this.lastNameInput.isValid || !this.usernameInput.isValid || !this.emailInput.isValid);
    }

    get body() {
        return (
            <View>
                <StyledTextInput
                    state={this.firstnameState}
                    validations={firstName}
                    hint={tx('title_firstName')}
                    maxLength={24}
                    required
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={this.onSubmitFirstName}
                    ref={this.firstNameInputRef}
                    testID="firstName" />
                <StyledTextInput
                    state={this.lastnameState}
                    validations={lastName}
                    hint={tx('title_lastName')}
                    maxLength={24}
                    required
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={this.onSubmitLastName}
                    ref={this.lastNameInputRef}
                    testID="lastName" />
                <StyledTextInput
                    state={this.usernameState}
                    validations={username}
                    hint={tx('title_username')}
                    lowerCase
                    required
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={this.onSubmitUsername}
                    ref={this.usernameInputRef}
                    testID="username" />
                <CountryPickerBox />
                <SpecialityPickerBox />
                <RolePickerBox />

                <StyledTextInput
                    state={this.emailState}
                    validations={email}
                    hint={tx('title_email')}
                    lowerCase
                    keyboardType="email-address"
                    returnKeyType="go"
                    required
                    ref={this.emailInputRef}
                    testID="email" />
                {/* <LanguagePickerBox /> */}
                <View style={[{ flexGrow: 1 }]} />
            </View>
        );
    }

    render() {
        return (
            <View style={outerContainer}>
                <View style={innerContainer}>
                    <View style={header2}>
                        <Text style={headingStyle2}>{tx('title_createAccount')}</Text>
                    </View>
                    <View>
                        <View style={innerSmall}>
                            <View style={formStyle}>
                                {this.body}
                            </View>
                        </View>
                    </View>
                    <View style={[buttonRowStyle, { justifyContent: 'space-between' }]}>
                        {this.button('button_back', () => signupState.routes.app.loginStart())}
                        {this.button('button_next',
                            () => this.handleNextButton(),
                            false,
                            this.isNextDisabled)}
                    </View>
                    <View style={footer}>
                        <Text style={signupTextStyle}>
                            <T k="title_TOSRequestText">{tosParser}</T>
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
