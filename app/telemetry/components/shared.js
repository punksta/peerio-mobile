/*
    These are the events for components that are shared between multiple views.
    Since they appear in more than one place, they need to know the current route for the `Sublocation` prop.
    Thus, they need to react to TmHelper.currentRoute.
*/
import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import TmHelper from '../helpers';

const { S, textInput } = telemetry;

const shared = setup({
    styledTextInputOnFocus: (label) => {
        return textInput(label, null, TmHelper.currentRoute, S.IN_FOCUS);
    },

    styledTextInputOnBlur: (label, errorMsg) => {
        if (errorMsg === 'error_usernameNotAvailable') return null;
        return textInput(label, null, TmHelper.currentRoute, S.ERROR, errorMsg);
    },

    // We need to send the Username Not Available error whenever it occurs
    styledTextInputOnError: (label, errorMsg) => {
        if (errorMsg !== 'error_usernameNotAvailable') return null;
        return textInput(label, null, TmHelper.currentRoute, S.ERROR, errorMsg);
    },

    startAccountCreation: () => {
        return [
            S.START_ACCOUNT_CREATION,
            {
                text: S.CREATE_ACCOUNT,
                sublocation: TmHelper.currentRoute
            }
        ];
    }
});


module.exports = shared;
