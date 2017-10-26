import { Platform } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { getRandomNumber, getRandomUserSpecificIdB64 } from '../../lib/peerio-icebear/crypto/util.random';

class ChatVideo extends SafeComponent {
    get storeLink() {
        const androidJitsi = 'https://play.google.com/store/apps/details?id=org.jitsi.meet';
        const iosJitsi = 'https://itunes.apple.com/in/app/jitsi-meet/id1165103905?mt=8';
        return Platform.OS === 'android' ? androidJitsi : iosJitsi;
    }

    get jitsiLink() {
        let randomString = getRandomUserSpecificIdB64(getRandomNumber(42, 1337));
        randomString = randomString.replace(/(\/)/, '+');
        return `https://meet.jit.si/${randomString}`;
    }
}

export default new ChatVideo();
