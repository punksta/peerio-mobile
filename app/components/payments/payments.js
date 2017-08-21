import React from 'react';
import { View, Text } from 'react-native';
import settingsState from '../settings/settings-state';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import plans from './payments-config';
import paymentsNative from './payments-native';
import { tx } from '../utils/translator';

function upgradeMessage(title) {
    const container = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: vars.lightGrayBg,
        height: vars.inputHeight,
        paddingLeft: 18,
        paddingRight: 10
    };

    const text = {
        color: vars.txtDark
    };

    return (
        <View style={container}>
            <Text style={text}>{title}</Text>
            {buttons.uppercaseBlueButton('button_upgrade',
                () => settingsState.upgrade())}
        </View>
    );
}

function upgradeForFiles() {
    return !plans.userHasPaidPlan() && paymentsNative.showFileUpgradeOffer ?
        upgradeMessage(tx('title_outOfStorage')) : null;
}

function upgradeForArchive() {
    return !plans.userHasPaidPlan() && paymentsNative.showArchiveUpgradeOffer ?
        upgradeMessage(tx('title_upgradeForArchive')) : null;
}

export { upgradeForFiles, upgradeForArchive };
export default paymentsNative;
