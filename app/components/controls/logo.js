import React, { Component } from 'react';
import {
    Image
} from 'react-native';
import Center from './center';


export default class Logo extends Component {
    render() {
        return (
            <Center style={{ marginBottom: 20, marginTop: 30 }}>
                <Image style={{ flex: 1, height: 120 }} resizeMode="contain"
                       source={require('../../assets/peerio-logo-white.png')} />
            </Center>
        );
    }
}

