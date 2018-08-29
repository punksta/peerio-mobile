import { PAGE_NAMES, PAGE_COMPONENTS } from './signup-screens-peerio';
import ChatList from '../../../components/messaging/chat-list';
import Chat from '../../../components/messaging/chat';
import PeerioContactAddWarning from './peerio-contact-add-warning';
import ChannelInvite from '../../messaging/channel-invite';
import SignupStepIndicator from '../../signup/signup-step-indicator';

export default {
    ContactAddWarning: PeerioContactAddWarning,
    ChatList,
    Chat,
    ChannelInvite,
    SignupStepIndicator,
    PAGE_NAMES,
    PAGE_COMPONENTS
};
