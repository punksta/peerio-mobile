import React, { Component } from 'react';
import {
    View
} from 'react-native';
import styles from '../../styles/styles';

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
