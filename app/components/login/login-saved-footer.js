import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { t } from 'peerio-translator';
import loginState from './login-state';
import styles from '../../styles/styles';

export default class LoginSavedFooter extends Component {

    constructor(props) {
        super(props);
        this.touchID = this.touchID.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    touchID() {
    }

    changeUser() {
        loginState.clean();
    }

    render() {
        const style = styles.wizard.footer;
        return (
            <View style={styles.container.footer}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.left} onPressIn={this.touchID}>
                        <Text style={style.button.text}>{t('touchId')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button.right} onPressIn={this.changeUser}>
                        <Text style={style.button.text}>{t('login_changeUserButton')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
