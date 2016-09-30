import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
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
    }
    render() {
        const style = styles.wizard.footer;
        return (
            <View style={styles.container.footer}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.left} onPressIn={this.prev}>
                        <Text style={style.button.text}>Touch ID</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button.right} onPressIn={this.next}>
                        <Text style={style.button.text}>Change User</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
