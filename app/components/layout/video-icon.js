import { Platform } from 'react-native';
import HeaderIconBase from './header-icon-base';
import { popupSetupVideo } from '../shared/popups';
import preferenceStore from '../settings/preference-store';
import { getRandomNumber, getRandomUserSpecificIdB64 } from '../../lib/peerio-icebear/crypto/util.random';


export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';

    get storeLink() {
        const androidJitsi = 'https://play.google.com/store/apps/details?id=org.jitsi.meet';
        const iosJitsi = 'https://itunes.apple.com/in/app/jitsi-meet/id1165103905?mt=8';
        return Platform.OS === 'android' ? androidJitsi : iosJitsi;
    }

    // use icebear crypto to grab a random number, which can then make a random string for the jitsi link
    get jitsiLink() {
        let randomString = getRandomUserSpecificIdB64(getRandomNumber(42, 1337));
        randomString = randomString.replace(/(.{36}$)/, '').replace(/(\/)/, '+');
        const jitsiLink = `https://meet.jit.si/${randomString}`;
        const message = jitsiLink;
        return message;
    }


    // the action assigned to video icon, asynchronously grabs the user preferences
    action = async () => {
        const { prefs } = preferenceStore;
        // check if you've seen the popup, otherwise call the popup, then add jitsi link to props
        if (prefs.hasSeenJitsiSuggestionPopup || await popupSetupVideo(this.storeLink, null)) {
            prefs.hasSeenJitsiSuggestionPopup = true;
            // add function as a prop which then grabs the link when called
            this.props.onAddVideoLink(this.jitsiLink);
        }
    }
}
