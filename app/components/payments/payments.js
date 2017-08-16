import React from 'react';
import { View, Text, Platform } from 'react-native';
import PaymentsIos from './payments-ios';
import PaymentsAndroid from './payments-android';
import settingsState from '../settings/settings-state';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import plans from './payments-config';
import { tx } from '../utils/translator';

const payments = (Platform.OS === 'android') ? new PaymentsAndroid() : new PaymentsIos();

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
    return !plans.userHasPaidPlan() && payments.showFileUpgradeOffer ?
        upgradeMessage(tx('title_outOfStorage')) : null;
}

function upgradeForArchive() {
    return !plans.userHasPaidPlan() && payments.showArchiveUpgradeOffer ?
        upgradeMessage(tx('title_upgradeForArchive')) : null;
}

export { upgradeForFiles, upgradeForArchive };
export default payments;
