import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';
import signupState from '../signup/signup-state';
import Circles from '../controls/circles';

@observer
export default class SignupCircles extends Component {
    render() {
        return (
            <Circles count={signupState.count} current={signupState.current} />
        );
    }
}

