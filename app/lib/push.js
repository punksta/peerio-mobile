import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { when, reaction, observable } from 'mobx';
import { socket } from '../lib/icebear';

const pushState = observable({
    registered: false,
    enabled: true
});

function onRegister(token) {
    console.log(`push.js: OS: ${Platform.OS}, TOKEN: ${token.token}`);
    const payload = {};
    payload[Platform.OS] = token.token || token;
    reaction(() => socket.authenticated, authenticated => {
        if (!authenticated) {
            console.log(`push.js: unregistered`);
            pushState.registered = false;
            return;
        }
        console.log(`push.js: sending registration OS: ${JSON.stringify(payload)}`);
        socket.send('/auth/mobile-device/register', payload)
        .then(r => {
            console.log(`push.js: register result success ${JSON.stringify(r)}`);
            pushState.registered = true;
        })
        .catch(e => console.log('push.js: error registering', e));
    });
}

function enablePushNotifications() {
    PushNotification.configure({
        onRegister,

        onNotification(notification) {
            console.log('push.js: NOTIFICATION:', notification);
        },

        // GCM sender id
        senderID: '605156423279',

        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        popInitialNotification: true,
        requestPermissions: true
    });
}

function toggleServerSide(enable) {
    const action = enable ? 'enable' : 'disable';
    console.log(`push.js: ${action} push waiting for socket`);
    pushState.enabled = enable;
    when(() => pushState.registered && socket.authenticated, () => {
        if (enable !== pushState.enabled) return;
        console.log(`push.js: ${action} push request`);
        const req = `/auth/push/${action}`;
        socket.send(req)
            .then(r => console.log(`push.js: ${action} server ${r}`))
            .catch(e => console.error(e));
    });
}

const enableServerSide = () => toggleServerSide(true);
const disableServerSide = () => toggleServerSide(false);

if (__DEV__) {
    const TEST_TOKEN = 'a41f1b2e8e9279c81dd9c69c56fd060d25c743354a146d4d9dcddcd9bf73b0e6';
    onRegister({ token: TEST_TOKEN });
}

module.exports = { enablePushNotifications, enableServerSide, disableServerSide };
