import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';

import styles from '../../styles/styles';

export default class SetupWizard extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    setup wizard
                </Text>
            </View>
        );
    }
}

