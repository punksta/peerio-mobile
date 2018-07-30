import signupState from './signup-state';
import AvatarActionSheet from '../settings/avatar-action-sheet';

export default class SignupAvatarActionSheet {
    static show() {
        AvatarActionSheet.show(({ buffers, largeFileB64 }) => {
            signupState.avatarBuffers = buffers;
            signupState.avatarData = largeFileB64;
        });
    }
}
