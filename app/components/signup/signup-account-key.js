import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, Clipboard } from 'react-native';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { t, tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import LoginWizardPage, {
    header, inner, circleTopSmall, title2, row, container
} from '../login/login-wizard-page';

const formStyle = {
    padding: 20,
    justifyContent: 'space-between'
};

const addPhotoText = {
    fontSize: 14,
    color: vars.txtMedium,
    textAlign: 'center'
};

const addPhotoPlus = [addPhotoText, {
    fontSize: 30,
    fontWeight: 'bold',
    color: vars.white
}];

const textNormal = {
    color: vars.txtDark,
    fontSize: 16,
    lineHeight: 24
};

const accountKeyText = {
    color: vars.txtDark,
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    fontSize: 18,
    width: 240
};

const accountKeyRow = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

const smallText = {
    fontSize: 12,
    marginVertical: 8,
    color: vars.txtDark
};

const accountKeyView = {
    marginVertical: 10
};

@observer
export default class SignupStep1 extends LoginWizardPage {
    get body() {
        return (
            <View>
                <View style={[circleTopSmall, { backgroundColor: vars.txtMedium, borderWidth: 0 }]}>
                    <View>
                        <Text style={addPhotoPlus}>AK</Text>
                    </View>
                </View>
                <Text style={textNormal}>Hello {signupState.firstName || signupState.username},</Text>
                <Text style={textNormal}>Passwords are way stronger when computers make them. This Account Key was generated just for you.</Text>
                <View style={accountKeyView}>
                    <Text style={smallText}>Your Account Key</Text>
                    <View style={accountKeyRow}>
                        <Text style={accountKeyText} selectable>
                            {signupState.passphrase}
                        </Text>
                        {buttons.uppercaseBlueButton(tx('Copy'), () => Clipboard.setString(signupState.passphrase))}
                    </View>
                </View>
                <Text style={textNormal}>Peerio cannot access any of your data, including this Account Key, saving a backup may help you in the future.</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={container}>
                <View style={header}>
                    {/* TODO: peerio copy */}
                    <Text style={title2}>Account Key</Text>
                </View>
                <View style={inner}>
                    <View style={formStyle}>
                        {this.body}
                    </View>
                </View>
                <View style={[row, { justifyContent: 'space-between' }]}>
                    {this.button('button_back', () => signupState.prev())}
                    {this.button('button_next', () => signupState.next(), false, !signupState.nextAvailable)}
                </View>
                <ActivityOverlay large visible={signupState.isInProgress} />
            </View>
        );
    }
}
