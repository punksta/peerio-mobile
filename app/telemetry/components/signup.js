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

        next: () => {
            return [
                S.NAVIGATE,
                {
                    option: S.NEXT,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        create: () => {
            return [
                S.NAVIGATE,
                {
                    option: S.CREATE,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        skip: () => {
            return [
                S.NAVIGATE,
                {
                    option: S.SKIP,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        back: () => {
            return [
                S.NAVIGATE,
                {
                    option: S.BACK,
                    sublocation: TmHelper.currentRoute
                }
            ];
        }
    }
);

module.exports = signup;
