import HeaderIconBase from './header-icon-base';
import { popupSetupVideo } from '../shared/popups';
import ChatVideo from '../messaging/chat-video';
import preferenceStore from '../settings/preference-store';

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';

    // the action assigned to video icon, asynchronously grabs the user preferences
    action = async () => {
        const { prefs } = preferenceStore;
        // check if you've seen the popup, otherwise call the popup, then add jitsi link to props
        if (prefs.hasSeenJitsiSuggestionPopup || await popupSetupVideo(ChatVideo.storeLink)) {
            prefs.hasSeenJitsiSuggestionPopup = true;
            // add function as a prop which then grabs the link when called
            this.props.onAddVideoLink('www.google.com');
        }
    }
}
