import HeaderIconBase from './header-icon-base';
import { popupSetupVideo } from '../shared/popups';
import ChatVideo from '../messaging/chat-video';
import preferenceStore from '../settings/preference-store';
import { tx } from '../utils/translator';

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';

    // the action assigned to video icon, asynchronously grabs the user preferences
    action = async () => {
        const { prefs } = preferenceStore;
        const dialog = {
            titleText: tx('title_videoCall'),
            subText: tx('dialog_videoCall'),
            disc: tx('disclaimer_videoCall')
        };
        // check if you've seen the popup, otherwise call the popup, then add jitsi link to props
        if (prefs.hasSeenJitsiSuggestionPopup || await popupSetupVideo(dialog.titleText, dialog.subText, dialog.disc, ChatVideo.storeLink)) {
            prefs.hasSeenJitsiSuggestionPopup = true;
            // add function as a prop which then grabs the link when called
            this.props.onAddVideoLink(ChatVideo.jitsiLink);
        }
    }
}
