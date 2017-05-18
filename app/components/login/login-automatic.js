import React from 'react';
import { View, Text, StatusBar, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';
import { wizard, vars } from '../../styles/styles';
import Logo from '../controls/logo';
import Layout1 from '../layout/layout1';

const { height } = Dimensions.get('window');
const logoHeight = height * 0.33;

@observer
export default class LoginAutomatic extends LoginWizardPage {
    button(text, testID, onPress, highlight) {
        const buttonContainer = {
            marginHorizontal: vars.wizardPadding * 0.5,
            marginVertical: 20,
            alignItems: 'stretch',
            borderColor: '#FFFFFFBA',
            borderWidth: highlight ? 2 : 0,
            borderRadius: 4
        };
        const button = {
            padding: 12,
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.12)'
        };
        const buttonText = {
            fontWeight: 'bold'
        };
        return (
            <View style={buttonContainer} key={text} testID={testID}>
                {this._button(text, onPress, button, buttonText)}
            </View>
        );
    }

    body() {
        const padded = {
            paddingHorizontal: vars.wizardPadding,
            alignItems: 'center'
        };
        const padded2 = {
            flex: 1,
            paddingHorizontal: vars.wizardPadding,
            alignItems: 'stretch'
        };
        const noticeText = {
            color: vars.white,
            fontSize: 24
        };
        const normalText = {
            color: vars.white,
            marginBottom: 22
        };
        return (
            <View style={padded}>
                <View>
                    <Text style={noticeText}>{t('title_enableAutomatic')}</Text>
                </View>
                <View style={padded2}>
                    {this.button('button_enable', 'automaticLoginEnable', () => (loginState.selectedAutomatic = true), true)}
                    <Text style={normalText}>{t('title_enableAutomatic1')}</Text>
                    {this.button('button_disable', 'automaticLoginDisable', () => (loginState.selectedAutomatic = false), false)}
                    <Text style={normalText}>{t('title_enableAutomatic2')}</Text>
                </View>
            </View>
        );
    }

    render() {
        const style = wizard;
        const body = (
            <View
                style={[style.containerFlex, { alignItems: 'center' }]}>
                <View style={{ height: logoHeight, justifyContent: 'center' }}>
                    <Logo />
                </View>
                {this.body()}
                <StatusBar barStyle="light-content" />
            </View>
        );
        return <Layout1 body={body} />;
    }
}
