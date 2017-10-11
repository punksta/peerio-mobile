import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Image } from 'react-native';
import signupState from './signup-state';
import { topCircleSizeSmall } from '../login/login-wizard-page';
import { helpers } from '../../styles/styles';

@observer
export default class SignupAvatar extends Component {
    render() {
        const width = topCircleSizeSmall * 2;
        const height = width;
        const style = [
            helpers.circle(width), { width, height, backgroundColor: 'transparent' }
        ];
        return (
            <Image style={style} source={{ uri: `data:image/png;base64,${signupState.avatarData}` }} />
        );
    }
}
