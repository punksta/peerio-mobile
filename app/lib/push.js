import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { when } from 'mobx';
import { socket } from '../lib/icebear';

const TEST_TOKEN = 'a41f1b2e8e9279c81dd9c69c56fd060d25c743354a146d4d9dcddcd9bf73b0e6';
let registered = false;

function onRegister(token) {
    console.log(`push.js: OS: ${Platform.OS}, TOKEN: ${token.token}`);
    const payload = {};
    payload[Platform.OS] = token.token || token;
    const registerPush = () => {
        console.log(`push.js: sending registration OS: ${JSON.stringify(payload)}`);
        return socket.send('/auth/mobile-device/register', payload)
        .then(r => {
            registered = true;
            console.log(`push.js: register result success ${JSON.stringify(r)}`);
            when(() => !socket.authenticated, () => (registered = false));
        })
        .catch(e => console.log('push.js: error registering', e));
    };
    when(() => socket.authenticated, () => {
        registerPush();
        socket.onAuthenticated(registerPush);
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

function enableServerSide() {
    when(() => registered && socket.authenticated, () =>
         socket.send('/auth/push/enable')
             .then(r => console.log(`push.js: enabled server ${r}`))
             .catch(e => console.error(e))
        );
}

function disableServerSide() {
    when(() => registered && socket.authenticated, () =>
         socket.send('/auth/push/disable')
             .then(r => console.log(`push.js: disabled server ${r}`))
             .catch(e => console.error(e))
        );
}

// if (__DEV__) {
//     onRegister({ token: TEST_TOKEN });
// }

module.exports = { enablePushNotifications, enableServerSide, disableServerSide };
