import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import { User } from '../../lib/icebear';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
    backgroundColor: vars.settingsBg
};

const headerStyle = {
    color: vars.txtDark,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8
};

const buttonCenterStyle = {
    marginVertical: paddingVertical,
    flexDirection: 'row',
    justifyContent: 'center'
};

@observer
export default class TwoFactorAuthCodesGenerate extends SafeComponent {
    renderThrow() {
        return (
            <View style={bgStyle}>
                <View>
                    <Text style={headerStyle}>
                        {tx('Two factor authentication is enabled\n\n')}
                        {tx('title_2FABackupCode')}
                    </Text>
                    <View style={buttonCenterStyle}>
                        {buttons.uppercaseBlueBgButton(tx('button_2FAGenerateCodes'), () => {})}
                    </View>
                </View>
                <View style={{ left: paddingHorizontal + 12, bottom: paddingVertical, position: 'absolute' }}>
                    {buttons.uppercaseRedButton('button_2FADeactivate', () => User.current.disable2fa())}
                </View>
            </View>
        );
    }
}
