import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';
import signupState from '../signup/signup-state';

@observer
export default class Circles extends Component {
    circle(i, current) {
        const style = styles.circle.small;
        return <View key={i} style={i === current ? style.active : style.normal} />;
    }
    render() {
        const circles = [];
        for (let i = 0; i < signupState.count; ++i) {
            circles.push(this.circle(i, signupState.current));
        }
        return (
            <View style={styles.circle.container}>
                {circles}
            </View>
        );
    }
}
