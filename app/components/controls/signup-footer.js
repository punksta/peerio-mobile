import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import TextBox from '../controls/textbox';
import { styles } from '../../styles/styles';

export default class Circles extends Component {
    render() {
        return (
            <View style={styles.circle.container}>
                <View style={styles.circle.small.active} />
                <View style={styles.circle.small.normal} />
                <View style={styles.circle.small.normal} />
                <View style={styles.circle.small.normal} />
                <View style={styles.circle.small.normal} />
            </View>
        );
    }
}
export default class Footer extends Component {
    render() {
        var style = styles.wizard.footer;
        return (
            <View style={styles.container.footer}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.left}>
                        <Text style={style.button.text} onPress={ () => Actions.pop() }>EXIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button.right}>
                        <Text style={style.button.text} onPress={ () => Actions.signupStep2() }>NEXT</Text>
                    </TouchableOpacity>
                </View>
                <Circles />
            </View>
        );
    }
}

