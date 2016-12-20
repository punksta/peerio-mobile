import React, { Component } from 'react';
import {
    Image, Dimensions
} from 'react-native';
import Center from './center';
import styles from '../../styles/styles';

const expandooLogo = require('../../assets/expandoo-logo-white.png');
const peerioLogo = require('../../assets/peerio-logo-white.png');

const width = Dimensions.get('window').width;

export default class Logo extends Component {
    render() {
        const logo = styles.branding.name === 'expandoo' ? expandooLogo : peerioLogo;
        return (
            <Center style={{ padding: 10 }}>
                <Image testID="logo" style={{ height: 100 }} resizeMode="contain"
                       source={logo} />
            </Center>
        );
    }
}

