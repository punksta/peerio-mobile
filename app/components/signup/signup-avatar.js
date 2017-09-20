import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Image } from 'react-native';
import signupState from './signup-state';
import { topCircleSizeSmall } from '../login/login-wizard-page';

@observer
export default class SignupAvatar extends Component {
    render() {
        const width = topCircleSizeSmall * 2;
        const height = width;
        return (
            <Image style={{ width, height }} source={{ uri: `data:image/png;base64,${signupState.avatarData}` }} />
        );
    }
}
