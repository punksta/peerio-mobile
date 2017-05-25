import { t, tu } from '../utils/translator';
import { User } from '../../lib/icebear';
import uiState from '../layout/ui-state';
import PinModal from './pin-modal';

export default class PinModalAsk extends PinModal {
    skipText = tu('button_cancel');
    initialText = t('title_enterPIN');
    onEnter = pin => User.current.validatePasscode(pin);
    onSuccess = passphrase => uiState.routerModal.discard(passphrase);
}
