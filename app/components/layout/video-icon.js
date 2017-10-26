import HeaderIconBase from './header-icon-base';
import { popupSetupVideo } from '../shared/popups';
import ChatVideo from '../messaging/chat-video';
import preferenceStore from '../settings/preference-store';

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';

    action = async () => {
        const { prefs } = preferenceStore;
        if (prefs.hasSeenJitsiSuggestionPopup
            || await popupSetupVideo(ChatVideo.storeLink)) {
            prefs.hasSeenJitsiSuggestionPopup = true;
            this.props.onAddVideoLink(ChatVideo.jitsiLink);
        }
    }
}
