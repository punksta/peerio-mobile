import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';
import { observable, when } from 'mobx';
import TextBox from '../controls/textbox';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import LoginWizardPage, {
    header, innerSmall, circleTopSmall, title2, row, container
} from '../login/login-wizard-page';

const formStyle = {
    padding: 20,
    justifyContent: 'space-between'
};

const textNormal = {
    color: vars.txtDark,
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 10
};

const titleDark = [textNormal, {
    fontWeight: 'bold'
}];

@observer
export default class SignupConfirmBackup extends LoginWizardPage {
    @observable confirmTextSample = tx('title_confirmTextSample');
    @observable confirmText = '';

    get isOk() { return this.confirmTextSample.toLowerCase() === this.confirmText.toLowerCase(); }

    get icon() {
        return <View style={[circleTopSmall, { backgroundColor: vars.txtMedium, borderWidth: 0 }]} />;
    }

    componentDidMount() {
        when(() => this.isOk, () => {
            this._textBox.blur();
            signupState.keyBackedUp = true;
        });
    }

    render() {
        return (
            <View style={container} onLayout={this._layout}>
                <View style={header}>
                    {/* TODO: peerio copy */}
                    <Text style={title2}>Account Key</Text>
                </View>
                <View style={{ flex: 0.7, flexGrow: 1, alignItems: 'flex-start' }}>
                    <View style={innerSmall}>
                        <View style={formStyle}>
                            <Text style={titleDark}>Remember, we can’t access your data.</Text>
                            <Text style={textNormal}>Only you have a copy of your Account Key. </Text>
                            <Text style={textNormal}>If you lose it, we cannot help you access your account.</Text>
                            <Text style={textNormal}>{tx('title_confirmTextInput', { sample: this.confirmTextSample })}</Text>
                            <View style={{ flex: 1, flexGrow: 1, justifyContent: 'center' }}>
                                <TextBox
                                    customIcon={this.isOk ? 'check-circle' : null}
                                    disabled={this.isOk}
                                    ref={ref => { this._textBox = ref; }}
                                    lowerCase key="usernameLogin"
                                    state={this}
                                    name="confirmText"
                                    placeholder={this.confirmTextSample}
                                    testID="confirmText"
                                    hint={this.confirmTextSample} />
                            </View>
                        </View>
                    </View>
                    {this.icon}
                </View>
                <View style={[row, { justifyContent: 'space-between' }]}>
                    {this.button('button_back', () => signupState.prev())}
                    {this.button('button_finish', () => signupState.next(), false, !signupState.keyBackedUp)}
                </View>
                <ActivityOverlay large visible={signupState.isInProgress} />
            </View>
        );
    }
}
