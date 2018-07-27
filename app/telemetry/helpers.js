import { Dimensions, Platform } from 'react-native';
import deviceInfo from 'react-native-device-info';
import { vars } from '../styles/styles';

const { height, width } = Dimensions.get('window');

function getCurrentRoute() {
    return this.currentRoute;
}

function setCurrentRoute(newRoute) {
    this.currentRoute = newRoute;
}

function send(telemetry, event) {
    // Basic properties to send with all events.
    // There are additional baseProps on SDK. These are mobile-specific.
    const baseProps = {
        screenWidth: width,
        screenHeight: height,
        brand: deviceInfo.getBrand(),
        model: deviceInfo.getModel(),
        screenDpi: vars.devicePixelRatio,
        operatingSystem: Platform.OS,
        osVersion: Platform.Version
    };

    const obj = {
        event: event[0],
        properties: event[1] || {}
    };
    obj.properties = Object.assign(obj.properties, baseProps);
    telemetry.send(obj);
}

module.exports = {
    send,
    getCurrentRoute,
    setCurrentRoute
};
