import React from 'react';
import { View, Text } from 'react-native';
import { t, tx } from '../utils/translator';
// import LanguagePickerBox from '../controls/language-picker-box';
import TextBox from '../controls/textbox';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import LoginWizardPage, {
    header, title1, title3, title2, row, container
} from './login-wizard-page';
import { vars } from '../../styles/styles';
import DebugMenuTrigger from '../shared/debug-menu-trigger';

const header2 = [header, { marginBottom: vars.login.spacing.normal, justifyContent: 'flex-end' }];

const inner2 = {
    borderRadius: 4,
    backgroundColor: vars.white,
    justifyContent: 'center',
    minHeight: 300
};

const footer = {
    justifyContent: 'flex-end',
    alignItems: 'center'
};

const formStyle = {
    padding: vars.login.spacing.normal,
    justifyContent: 'space-between'
};

const findKeyText = {
    alignSelf: 'center',
    color: vars.bg,
    fontSize: vars.font.size.normal
};

export default class LoginClean extends LoginWizardPage {
    render() {
        return (
            <View style={container}>
                <View style={header2}>
                    <DebugMenuTrigger>
                        <View style={header2}>
                            <Text style={title1}>{t('title_welcome')}</Text>
                            <Text style={title2}>{t('title_login')}</Text>
                        </View>
                    </DebugMenuTrigger>
                </View>
                <View>
                    <View style={inner2}>
                        <View style={formStyle}>
                            <TextBox
                                lowerCase key="usernameLogin"
                                state={loginState}
                                name="username"
                                testID="usernameLogin"
                                hint={t('title_username')} />
                            <TextBox key="usernamePassword"
                                returnKeyType="go"
                                onSubmit={() => this.props.submit()}
                                state={loginState} name="passphrase" hint={t('title_AccountKey')} secureTextEntry />
                            {/* TODO: peerio copy */}
                            {/* TODO: make link active */}
                            <Text style={findKeyText}>{tx('title_whereToFind')}</Text>
                        </View>
                    </View>
                    <View style={[row, { justifyContent: 'flex-end' }]}>
                        {this.button(
                            'button_login',
                            () => this.props.submit(),
                            loginState.isInProgress, !loginState.passphrase || !loginState.isValid())}
                    </View>
                </View>
                <View style={footer}>
                    {/* TODO: peerio copy */}
                    <Text style={title3}>
                        {tx('title_signupHere')}
                    </Text>
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
