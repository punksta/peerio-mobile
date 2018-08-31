import { telemetry } from '../lib/icebear';
import login from './components/login';
import signup from './components/signup';
import shared from './components/shared';

function initTelemetry() {
    telemetry.init();
}

module.exports = {
    initTelemetry,
    login,
    signup,
    shared
};
