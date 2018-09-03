import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import TmHelper from '../helpers';

const { S, duration } = telemetry;

const location = S.ONBOARDING;
const signup = setup(
    {
        duration: (startTime) => {
            return [
                S.DURATION,
                {
                    location,
                    sublocation: TmHelper.currentRoute,
                    totalTime: duration(startTime)
                }
            ];
        },

        durationItem: (startTime, item) => {
            return [
                S.DURATION,
                {
                    item,
                    location: S.ONBOARDING,
                    totalTime: duration(startTime)
                }
            ];
        },

        onStartAccountCreation: () => {
            return [
                S.START_ACCOUNT_CREATION, {
                    location,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        pickUsername: (errorFlag) => {
            return [S.PICK_USERNAME, { option: errorFlag }];
        },

        toggleNewsletterCheckbox: (checked) => {
            return [
                S.SET_SETTING,
                {
                    option: S.RECEIVE_EMAIL,
                    on: checked,
                    item: S.NEWSLETTER,
                    location: S.ONBOARDING
                }
            ];
        },

        copyAk: () => {
            return [
                S.COPY,
                {
                    item: S.ACCOUNT_KEY,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        navigate: (option) => {
            return [
                S.NAVIGATE,
                {
                    option,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        viewLink: (item) => {
            return [
                S.VIEW_LINK,
                {
                    item,
                    location: S.ONBOARDING
                }
            ];
        },

        onTosAccordionPress: (item) => {
            return [
                S.READ_MORE,
                {
                    item,
                    location: S.ONBOARDING
                }
            ];
        },

        acceptTos: () => {
            return [S.ACCEPT_TERMS];
        },

        declineTos: () => {
            return [S.DECLINE_TERMS];
        },

        shareData: (on) => {
            return [
                S.SET_SETTING,
                {
                    option: S.SHARE_DATA,
                    on,
                    item: S.CRASH_AND_ERROR_DATA,
                    location: S.ONBOARDING
                }
            ];
        },

        finishSignup: () => {
            return [S.FINISH_ACCOUNT_CREATION];
        }
    }
);

module.exports = signup;
