import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import randomWords from 'random-words';
import capitalize from 'capitalize';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import icons from '../helpers/icons';

const { validators } = validation;
const { firstName, lastName } = validators;

@observer
export default class SignupStep1 extends SafeComponent {
    firstnameState = observable({ value: '' });
    lastnameState = observable({ value: '' });

    @action.bound firstNameInputRef(ref) { this.firstNameInput = ref; }
    @action.bound lastNameInputRef(ref) { this.lastNameInput = ref; }

    @action.bound onSubmitFirstName() { this.lastNameInput.onFocus(); }

    componentDidMount() {
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            this.firstNameInput.onChangeText(capitalize(randomWords()));
            this.lastNameInput.onChangeText(capitalize(randomWords()));
        }
        // fill fields when returning from another step
        if (signupState.firstName) {
            this.firstnameState.value = signupState.firstName;
            this.firstNameInput.onChangeText(this.firstnameState.value);
        }
        if (signupState.lastName) {
            this.lastnameState.value = signupState.lastName;
            this.lastNameInput.onChangeText(this.lastnameState.value);
        }
    }

    @action.bound handleNextButton() {
        signupState.firstName = this.firstnameState.value;
        signupState.lastName = this.lastnameState.value;
        signupState.next();
    }

    get isNextDisabled() {
        return socket.connected && (!this.firstnameState.value ||
            !this.firstNameInput.isValid || !this.lastNameInput.isValid);
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.progressBarContainer}>
                    <View style={signupStyles.filledProgressBar} />
                    <View style={[signupStyles.emptyProgressBar, { marginHorizontal: 1 }]} />
                    <View style={signupStyles.emptyProgressBar} />
                </View>
                <View style={signupStyles.container}>
                    <View style={signupStyles.backButtonContainer}>
                        {icons.basic('arrow-back', vars.darkBlue, signupState.prev, null, null, true, 'back')}
                    </View>
                    <View style={signupStyles.headerContainer}>
                        <Text semibold serif style={signupStyles.headerStyle}>{tx('title_createYourAccount')}</Text>
                        <Text style={signupStyles.headerDescription}>{tx('title_nameHeading')}</Text>
                    </View>
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
                        ref={this.lastNameInputRef}
                        testID="lastName" />
                    <View style={{ alignItems: 'flex-end' }}>
                        {buttons.roundBlueBgButton(
                            tx('button_next'),
                            this.handleNextButton,
                            this.isNextDisabled,
                            'button_next',
                            { width: vars.signupButtonWidth, marginTop: 30 })}
                    </View>
                </View>
            </View>
        );
    }
}
