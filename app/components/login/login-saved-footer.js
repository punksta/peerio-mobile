import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { t } from '../utils/translator';
import loginState from './login-state';
import { common, button, wizard } from '../../styles/styles';

export default class LoginSavedFooter extends Component {
    render() {
        const style = wizard.footer;
        const enabled = !loginState.isInProgress;
        return (
            <View style={[common.container.footer, { opacity: enabled ? 1 : 0.5 }]}>
                <View style={style.row}>
                    <TouchableOpacity
                        style={button.base}
                        onPress={() => enabled && loginState.useMasterPassword()}>
                        <Text style={button.text.normal}>{t('button_useMasterPassword')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={button.base}
                        onPress={() => enabled && loginState.changeUserAction()}>
                        <Text style={button.text.normal}>{t('button_changeUserMobile')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
