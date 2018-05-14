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
import uiState from '../layout/ui-state';

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
    medicalIdState = observable({ value: '' });
    @action.bound medicalIdInputRef(ref) { this.medicalIdInput = ref; }

    @action.bound handleNextButton() {
        signupState.country = uiState.countrySelected;
        signupState.speciality = uiState.specialitySelected;
        signupState.role = uiState.roleSelected;
        signupState.medicalId = this.medicalIdState.value;
        console.log(signupState);
        // signupState.next();
    }

    get isNextDisabled() {
        // TODO add medicalId validation: this.medicalIdInput.isValid
        // return socket.connected && (!this.countryState.value || !this.firstNameInput.isValid ||
        //     !this.lastNameInput.isValid || !this.usernameInput.isValid || !this.emailInput.isValid);
        return !socket.connected;
    }

    get body() {
        return (
            <View>
                <CountryPickerBox />
                <SpecialityPickerBox />
                <RolePickerBox />
                <StyledTextInput
                    state={this.medicalIdState}
                    // validations={ } // TODO add validation
                    hint={tx('title_medicalId')}
                    lowerCase
                    returnKeyType="go"
                    required
                    ref={this.medicalIdInputRef}
                    testID="medicalId" />
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
