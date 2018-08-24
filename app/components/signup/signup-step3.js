import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import icons from '../helpers/icons';
import CheckBox from '../shared/checkbox';

const { validators } = validation;
const { email } = validators;

const checkboxContainer = {
    marginBottom: vars.spacing.small.maxi
};

@observer
export default class SignupStep3 extends SafeComponent {
    @observable checked = false;
    emailState = observable({ value: '' });
    @action.bound emailInputRef(ref) { this.emailInput = ref; }

    componentDidMount() {
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            const rnd = new Date().getTime() % 100000;
            this.emailInput.onChangeText(`${rnd}@test`);
        }
        // fill fields when returning from another step
        if (signupState.email) {
            this.emailState.value = signupState.email;
            this.emailInput.onChangeText(this.emailState.value);
        }
        this.checked = signupState.newsletterSubscription;
    }

    @action.bound toggleChecked() { this.checked = !this.checked; }

    @action.bound handleNextButton() {
        signupState.email = this.emailState.value;
        signupState.subscribeToPromoEmails = this.checked;
        signupState.next();
    }

    get isNextDisabled() { return !socket.connected || !this.emailState.value || !this.emailInput.isValid; }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.progressBarContainer}>
                    <View style={signupStyles.filledProgressBar} />
                    <View style={[signupStyles.filledProgressBar, { marginHorizontal: 1 }]} />
                    <View style={signupStyles.filledProgressBar} />
                </View>
                <View style={signupStyles.container}>
                    <View style={signupStyles.backButtonContainer}>
                        {icons.basic('arrow-back', vars.darkBlue, signupState.prev, null, null, true, 'back')}
                    </View>
                    <View style={signupStyles.headerContainer}>
                        <Text semibold serif style={signupStyles.headerStyle}>{tx('title_createYourAccount')}</Text>
                        <Text style={signupStyles.headerDescription}>{tx('title_whatIsYourEmail')}</Text>
                    </View>
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
                    <View style={[signupStyles.separator, { marginBottom: 12 }]} />
                    <View style={checkboxContainer}>
                        <CheckBox
                            alignLeft
                            isChecked={this.checked}
                            onChange={this.toggleChecked}
                            text={tx('title_subscribeNewsletter')}
                            accessibilityLabel={tx('title_subscribeNewsletter')} />
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        {buttons.roundBlueBgButton(
                            tx('button_create'),
                            this.handleNextButton,
                            this.isNextDisabled,
                            'button_create',
                            { width: vars.signupButtonWidth, marginVertical: 30 })}
                    </View>
                </View>
            </View>
        );
    }
}
