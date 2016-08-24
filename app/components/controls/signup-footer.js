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

export default class Login extends Component {
    render() {
        return (
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <View style={{ height: 40, flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.buttonFooterLeft}>
                        <Text style={{ color: 'white' }} onPress={ () => Actions.pop() }>EXIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonFooterRight}>
                        <Text style={{ color: 'white' }} onPress={ () => Actions.signupStep2() }>NEXT</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 40, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.circleHighlight} />
                        <View style={styles.circle} />
                        <View style={styles.circle} />
                        <View style={styles.circle} />
                        <View style={styles.circle} />
                    </View>
                </View>
            </View>
        );
    }
}

