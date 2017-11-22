import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import signupState from './signup-state';
import AvatarActionSheet from '../settings/avatar-action-sheet';

@observer
export default class SignupAvatarActionSheet extends Component {
    saveAvatar = (buffers, base64File) => {
        signupState.avatarBuffers = buffers;
        signupState.avatarData = base64File;
    }

    show = () => this._actionSheet.show();

    render() {
        return (
            <AvatarActionSheet
                onSave={this.saveAvatar}
                ref={sheet => { this._actionSheet = sheet; }} />
        );
    }
}
