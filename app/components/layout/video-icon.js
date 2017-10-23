import { Platform } from 'react-native';
import HeaderIconBase from './header-icon-base';
import { getRandomNumber, getRandomUserSpecificIdB64 } from '../../lib/peerio-icebear/crypto/util.random';

const androidJitsi = 'https://play.google.com/store/apps/details?id=org.jitsi.meet&hl=en';
const iosJitsi = 'https://itunes.apple.com/in/app/jitsi-meet/id1165103905?mt=8';
const storeURL = Platform.OS === 'android' ? androidJitsi : iosJitsi;
let randomString = '';
const jitsiLink = '';

// set the app store link
// set the jitsi link
export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';
    randomString = getRandomUserSpecificIdB64(getRandomNumber(42, 1337));
    randomString = randomString.replace(/(\/)/, '+');
    jitsiLink = `https://meet.jit.si/${randomString}`;
    // this style needs to move to popups
    // style = { borderTopColor: vars.yellowLine, borderTopWidth: 8 };
    action = () => this.props.action(console.log(jitsiLink));
}
