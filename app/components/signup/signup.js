import React, { Component } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import Picker from 'react-native-picker';
import { styles } from '../../styles/styles';

export default class Signup extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    signup
                </Text>
            </View>
        );
    }
}

