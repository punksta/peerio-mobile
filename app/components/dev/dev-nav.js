import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import Picker from 'react-native-picker';
import styles from '../../styles/styles';

export default class DevNav extends Component {
    routeLink(route) {
        return (
            <View style={{ height: 40, flexDirection: 'row' }}>
                <TouchableOpacity style={styles.buttonPrimary} onPress={() => Actions[route]()}>
                    <Text style={{ color: 'white' }}>{route}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    render() {
        return (
            <View style={styles.rootContainer}>
                <View style={styles.container}>
                    {this.routeLink('signup')}
                    {this.routeLink('login')}
                    {this.routeLink('setup-wizard')}
                    {this.routeLink('conversation')}
                    {this.routeLink('conversation-info')}
                    {this.routeLink('files')}
                    {this.routeLink('contacts')}
                </View>
            </View>
        );
    }
}

