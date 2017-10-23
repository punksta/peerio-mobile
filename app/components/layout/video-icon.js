import { Platform } from 'react-native';
import HeaderIconBase from './header-icon-base';
// import { vars } from '../../styles/styles';
import { getRandomNumber, getRandomUserSpecificIdB64 } from '../../lib/peerio-icebear/crypto/util.random';

const androidJitsi = 'https://play.google.com/store/apps/details?id=org.jitsi.meet&hl=en';
const iosJitsi = 'https://itunes.apple.com/in/app/jitsi-meet/id1165103905?mt=8';
const storeURL = Platform.OS === 'android' ? androidJitsi : iosJitsi;
let randomString = getRandomUserSpecificIdB64(getRandomNumber(5, 100));
randomString = randomString.replace(/\//, '+');
const jitsiLink = `https://meet.jit.si/${randomString}`;

export default class VideoIcon extends HeaderIconBase {
    icon = 'videocam';
    // style = { borderTopColor: vars.yellowLine, borderTopWidth: 8 };
    action = () => this.props.action(console.log(jitsiLink));
}
