import React, { Component } from 'react';
import {
    Image
} from 'react-native';
import Center from './center';
import styles from '../../styles/styles';

const expandooLogo = require('../../assets/expandoo-logo-white.png');
const peerioLogo = require('../../assets/peerio-logo-white.png');

export default class Logo extends Component {
    render() {
        const logo = styles.branding.name === 'expandoo' ? expandooLogo : peerioLogo;
        return (
            <Center style={{ marginBottom: 20, marginTop: 30 }}>
                <Image testID="logo" style={{ flex: 1, height: 120 }} resizeMode="contain"
                       source={logo} />
            </Center>
        );
    }
}

