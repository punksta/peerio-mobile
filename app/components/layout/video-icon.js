import HeaderIconBase from './header-icon-base';
import chatState from '../messaging/chat-state';
import { popupSetupVideo } from '../shared/popups';
import preferenceStore from '../settings/preference-store';

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';

    // use icebear crypto to grab a random number, which can then make a random string for the jitsi link
    get jitsiLink() {
        const jitsiLink = chatState.store.generateJitsiUrl();
        const message = jitsiLink;
        return message;
    }

    get disabled() {
        // if there's no current chat or you can't send the link return true
        return (!chatState.currentChat || !chatState.canSendJitsi);
    }

    // the action assigned to video icon, asynchronously grabs the user preferences
    action = async () => {
        // check if it's ok to post the link
        const { prefs } = preferenceStore;
        if (!this.disabled) {
            // check if you've seen the popup, otherwise call the popup, then add jitsi link to props
            if (prefs.hasSeenJitsiSuggestionPopup || await popupSetupVideo(null)) {
                prefs.hasSeenJitsiSuggestionPopup = true;
                // add function as a prop which then grabs the link when called
                this.props.onAddVideoLink(this.jitsiLink);
            }
            this.disabled = true;
        }
    };
}
