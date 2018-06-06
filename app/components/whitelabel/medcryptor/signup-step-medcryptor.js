import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../../controls/custom-text';
import MedcryptorCountryPickerBox from './medcryptor-country-picker-box';
import MedcryptorSpecialtyPickerBox from './medcryptor-specialty-picker-box';
import MedcryptorRolePickerBox from './medcryptor-role-picker-box';
import Bold from '../../controls/bold';
import { vars } from '../../../styles/styles';
import signupState from '../../signup/signup-state';
import { popupTOS } from '../../shared/popups';
import { tx, T } from '../../utils/translator';
import LoginWizardPage, {
    header2, innerSmall, headingStyle2, footerText1, footerText2, innerContainer, outerContainer, buttonRowStyle
} from '../../login/login-wizard-page';
import StyledTextInput from '../../shared/styled-text-input';
import { socket, validation } from '../../../lib/icebear';
import medcryptorUiState from './medcryptor-ui-state';

const { validators } = validation;
const { mcrDoctorAhpraAvailability, mcrAdminAhpraAvailability } = validators;

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
const ahpraTextStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.black54,
    alignSelf: 'flex-start',
    margin: vars.spacing.medium.mini2x
};

@observer
export default class SignupStepMedcryptor extends LoginWizardPage {
    validations = {
        doctor: mcrDoctorAhpraAvailability,
        admin: mcrAdminAhpraAvailability
    };

    get ahpraValidator() {
        if (medcryptorUiState.roleSelected) {
            return this.validations[medcryptorUiState.roleSelected];
        }
        return this.validations.doctor;
    }

    medicalIdState = observable({ value: '' });
    @action.bound medicalIdInputRef(ref) { this.medicalIdInput = ref; }

    @action.bound handleNextButton() {
        signupState.country = medcryptorUiState.countrySelected;
        signupState.specialty = medcryptorUiState.specialtySelected;
        signupState.role = medcryptorUiState.roleSelected;
        signupState.medicalId = this.medicalIdState.value;
        signupState.next();
    }

    get selectedAU() {
        return medcryptorUiState.countrySelected === 'AU';
    }

    get isValidForAU() {
        return medcryptorUiState.countrySelected &&
            medcryptorUiState.specialtySelected &&
            medcryptorUiState.roleSelected &&
            this.medicalIdState.value &&
            this.medicalIdInput.isValid;
    }

    get isValidForNonAU() {
        return medcryptorUiState.countrySelected &&
            medcryptorUiState.roleSelected;
    }

    get isNextDisabled() {
        if (this.selectedAU) {
            return !(socket.connected && this.isValidForAU);
        }
        return !(socket.connected && this.isValidForNonAU);
    }

    get body() {
        return (
            <View>
                <MedcryptorCountryPickerBox />
                {this.selectedAU && <MedcryptorSpecialtyPickerBox />}
                <MedcryptorRolePickerBox />
                {this.selectedAU && <View>
                    <StyledTextInput
                        state={this.medicalIdState}
                        validations={[this.ahpraValidator]}
                        hint={tx('title_medicalId')}
                        lowerCase
                        returnKeyType="go"
                        required
                        ref={this.medicalIdInputRef}
                        testID="medicalId" />
                    <View style={footer}>
                        <Text style={ahpraTextStyle}>
                            <T k="title_medicalIdDescription" />
                        </Text>
                    </View>
                </View>}
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
                        {this.button('button_back', () => signupState.prev())}
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
