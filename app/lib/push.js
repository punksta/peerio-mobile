import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { when } from 'mobx';
import { socket } from '../lib/icebear';

function enablePushNotifications() {
    PushNotification.configure({
        onRegister(token) {
            console.log(`push.js: OS: ${Platform.OS}, TOKEN: ${token.token}`);
            const payload = {};
            payload[Platform.OS] = token.token || token;
            when(() => socket.authenticated, () =>
                 socket.send('/auth/registerMobileDevice', payload)
                     .then(r => {
                         console.log('push.js: register result success', r);
                         PushNotification.localNotification({ title: 'test', message: 'testmessage' });
                     })
                     .catch(e => console.error('push.js: error registering', e)));
        },

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
    return socket.send('/auth/push/enable');
}

function disableServerSide() {
    return socket.send('/auth/push/disable');
}

module.exports = { enablePushNotifications, enableServerSide, disableServerSide };
