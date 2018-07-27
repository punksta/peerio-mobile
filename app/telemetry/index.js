import { telemetry } from '../lib/icebear';
import login from './components/login';
import signup from './components/signup';
import shared from './components/shared';
import helpers from './helpers';

function initTelemetry() {
    telemetry.init();
}

module.exports = {
    initTelemetry,
    helpers,
    login,
    signup,
    shared
};
