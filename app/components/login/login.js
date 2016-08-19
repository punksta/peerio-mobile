import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import Picker from 'react-native-picker';
import { styles } from '../../styles/styles';

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Peerio Native Icebear Client
                </Text>
                <Text style={styles.instructions}>
                    Login:
                </Text>
                <TextInput
                    style={styles.input}
                    value={'enter login here'} />
                <Text style={styles.instructions}>
                    Passphrase or passcode:
                </Text>
                <TextInput
                    style={styles.input}
                    value={'enter passphrase here'} />
                <View style={{ height: 40, flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.buttonSafe} onPress={() => this.langPicker.toggle()}>
                        <Text style={{ color: 'white' }}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 10 }} />
                <View style={{ height: 40, flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={() => Actions.signup()}>
                        <Text style={{ color: 'white' }}>Signup</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 10 }} />
                <View style={{ height: 40, flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.pickerButton} onPress={() => this.langPicker.toggle()}>
                        <Text style={{ color: 'white' }}>{'Russian'}</Text>
                    </TouchableOpacity>
                </View>
                <Picker style={styles.picker}
                        ref={picker => { this.langPicker = picker; }}
                        pickerData={['Blah']} selectedValue="English" showMask />
            </View>
        );
    }
}

