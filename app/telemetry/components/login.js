import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import TmHelper from '../helpers';

const { S, duration, errorMessage } = telemetry;

const login = setup(
    {
        duration: (startTime) => {
            return [
                S.DURATION,
                {
                    location: S.SIGN_IN,
                    totalTime: duration(startTime)
                }
            ];
        },

        onNavigateLogin: () => {
            return [
                S.NAVIGATE, {
                    option: S.SIGN_IN,
                    location: S.ONBOARDING,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        onLoginClick: () => {
            return [
                S.SIGN_IN, { text: S.SIGN_IN }
            ];
        },

        onLoginWithEmail: (label, errorMsg) => {
            return [
                S.TEXT_INPUT,
                {
                    item: label,
                    location: TmHelper.currentRoute,
                    state: S.ERROR,
                    error: errorMessage(errorMsg)
                }
            ];
        },

        toggleAkVisibility: (isVisible) => {
            return [
                S.TOGGLE_VISIBILITY,
                {
                    location: TmHelper.currentRoute,
                    visible: isVisible,
                    item: S.ACCOUNT_KEY
                }
            ];
        }
    }
);

module.exports = login;
