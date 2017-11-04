import React from 'react';
import { Platform } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { getRandomNumber, getRandomUserSpecificIdB64 } from '../../lib/peerio-icebear/crypto/util.random';

class ChatVideo extends SafeComponent {
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
}

export default new ChatVideo();
