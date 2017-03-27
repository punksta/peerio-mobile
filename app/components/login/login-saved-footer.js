import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { t } from '../utils/translator';
import loginState from './login-state';
import styles from '../../styles/styles';

export default class LoginSavedFooter extends Component {
    render() {
        const style = styles.wizard.footer;
        const enabled = !loginState.isInProgress;
        return (
            <View style={[styles.container.footer, { opacity: enabled ? 1 : 0.5 }]}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.base} onPress={() => enabled && loginState.useMasterPassword()}>
                        <Text style={style.button.text}>{t('login_useMP')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button.base} onPress={() => enabled && loginState.changeUserAction()}>
                        <Text style={style.button.text}>{t('login_changeUserButton')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
