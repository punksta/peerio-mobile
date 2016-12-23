import PushNotification from 'react-native-push-notification';
import { socket } from '../lib/icebear';

function enablePushNotifications() {
    PushNotification.configure({
        onRegister(token) {
            console.log('push.js: TOKEN:', token);
            socket.send('registerMobileDevice', { ios: token })
                .then(r => console.log('push.js: register result success', r))
                .catch(e => console.error('push.js: error registering', e));
        },

        onNotification(notification) {
            console.log('push.js: NOTIFICATION:', notification);
        },

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

module.exports = { enablePushNotifications };
