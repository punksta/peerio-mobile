import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TextInput, Clipboard } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';

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

const whiteStyle = {
    backgroundColor: vars.white, paddingVertical: 10, paddingHorizontal
};

const row = { flexDirection: 'row' };

const rowRight = [row, { justifyContent: 'flex-end', marginTop: 12 }];

const column = { flex: 0.5, alignItems: 'center' };

const textStyle = { color: vars.txtDark, fontWeight: 'bold', marginVertical: 10 };

@observer
export default class TwoFactorAuthCodes extends SafeComponent {
    renderThrow() {
        return (
            <View style={bgStyle}>
                <View>
                    <Text style={headerStyle}>
                        {tx('title_2FABackupCode')}
                    </Text>
                    <View style={buttonCenterStyle}>
                        {buttons.uppercaseBlueBgButton(tx('button_2FAGenerateCodes'), () => {})}
                    </View>
                </View>
                <View style={whiteStyle}>
                    <View style={row}>
                        <View style={column}>
                            <Text style={textStyle}>345324</Text>
                            <Text style={textStyle}>045324</Text>
                            <Text style={textStyle}>190687</Text>
                            <Text style={textStyle}>345324</Text>
                            <Text style={textStyle}>045324</Text>
                            <Text style={textStyle}>190687</Text>
                        </View>
                        <View style={column}>
                            <Text style={textStyle}>954678</Text>
                            <Text style={textStyle}>737837</Text>
                            <Text style={textStyle}>910390</Text>
                            <Text style={textStyle}>954678</Text>
                            <Text style={textStyle}>737837</Text>
                            <Text style={textStyle}>910390</Text>
                        </View>
                    </View>
                    <View style={rowRight}>
                        {buttons.uppercaseBlueButton('Download')}
                    </View>
                </View>
                <View style={{ left: paddingHorizontal + 12, bottom: paddingVertical, position: 'absolute' }}>
                    {buttons.uppercaseRedButton('button_2FADeactivate', () => this.deactivate2FA())}
                </View>
            </View>
        );
    }
}
