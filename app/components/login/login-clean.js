import React from 'react';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import LanguagePickerBox from '../controls/language-picker-box';
import TextBox from '../controls/textbox';
import Center from '../controls/center';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';

@observer
export default class LoginClean extends LoginWizardPage {
    items() {
        return [
            <TextBox lowerCase key="u" state={loginState} name="username" hint={t('username')} />,
            <LanguagePickerBox key="lpp" />
        ];
    }

    buttons() {
        return (
            <Center>
                {this._footerButton('continue', () => this.props.submit(), null, !loginState.usernameValid)}
            </Center>
        );
    }
}
