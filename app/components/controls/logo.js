import React, { Component } from 'react';
import {
    Image, Dimensions
} from 'react-native';
import Center from './center';
import styles from '../../styles/styles';

const expandooLogo = require('../../assets/expandoo-logo-white.png');
const peerioLogo = require('../../assets/peerio-logo-white.png');

const origWidth = 1189;
const origHeight = 472;
const width = Dimensions.get('window').width - 100;
const height = width / origWidth * origHeight;


export default class Logo extends Component {
    render() {
        const logo = styles.branding.name === 'expandoo' ? expandooLogo : peerioLogo;
        return (
            <Center style={{ marginBottom: 32, marginTop: 48, flexGrow: 0 }}>
                <Image testID="logo" style={{ height, width }} source={logo} />
            </Center>
        );
    }
}
