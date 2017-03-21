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

    useMP() {

    }

    render() {
        const style = styles.wizard.footer;
        return (
            <View style={styles.container.footer}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.left} onPress={() => this.useMP()}>
                        <Text style={style.button.text}>{t('login_useMP')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button.base} onPress={() => loginState.changeUserAction()}>
                        <Text style={style.button.text}>{t('login_changeUserButton')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
