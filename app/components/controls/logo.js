import React, { Component } from 'react';
import { Scene, Router, TabBar, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    View,
    Image
} from 'react-native';
import styles from '../../styles/styles';
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

