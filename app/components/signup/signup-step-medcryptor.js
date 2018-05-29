import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import CountryPickerBox from '../controls/country-picker-box';
import SpecialtyPickerBox from '../controls/specialty-picker-box';
import RolePickerBox from '../controls/role-picker-box';
import Bold from '../controls/bold';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { popupTOS } from '../shared/popups';
import { tx, T } from '../utils/translator';
import LoginWizardPage, {
    header2, innerSmall, headingStyle2, footerText1, footerText2, innerContainer, outerContainer, buttonRowStyle
} from '../login/login-wizard-page';
import StyledTextInput from '../shared/styled-text-input';
import { socket } from '../../lib/icebear';
import whiteLabelUiState from '../layout/medcryptor-ui-state';

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
    medicalIdState = observable({ value: '' });
    @action.bound medicalIdInputRef(ref) { this.medicalIdInput = ref; }

    @action.bound handleNextButton() {
        signupState.country = whiteLabelUiState.countrySelected;
        signupState.specialty = whiteLabelUiState.specialtySelected;
        signupState.role = whiteLabelUiState.roleSelected;
        signupState.medicalId = this.medicalIdState.value;
        signupState.next();
    }

    get selectedAU() {
        return whiteLabelUiState.countrySelected === 'AU';
    }

    get isValidForAU() {
        // TODO add medicalId validation: this.medicalIdInput.isValid
        return whiteLabelUiState.countrySelected &&
            whiteLabelUiState.specialtySelected &&
            whiteLabelUiState.roleSelected &&
            this.medicalIdState.value;
    }

    get isValidForNonAU() {
        return whiteLabelUiState.countrySelected &&
            whiteLabelUiState.roleSelected;
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
                <CountryPickerBox />
                {this.selectedAU && <SpecialtyPickerBox />}
                <RolePickerBox />
                {this.selectedAU && <View>
                    <StyledTextInput
                        state={this.medicalIdState}
                        // validations={ } // TODO add validation
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
