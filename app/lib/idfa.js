import { Platform, NativeModules } from 'react-native';

const { RNACTReporter } = NativeModules;

const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';

async function enableIdfa() {
    if (Platform.OS === 'ios' && EN === 'peeriomobile') {
        console.debug('idfa.js: enabling install tracking');
        await RNACTReporter.trackInstall('925294045', 'ibZrCMiki3IQ3bubuQM');
        console.debug('idfa.js: install tracking enabled');
    }
}

module.exports = { enableIdfa };
