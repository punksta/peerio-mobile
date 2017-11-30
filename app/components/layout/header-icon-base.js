import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

@observer
export default class HeaderIconBase extends SafeComponent {
    icon = '';
    action = () => { };
    disabled = false;
    renderThrow() {
        return (
            <View style={[{ flex: 0, opacity: this.disabled ? 0.5 : 1 }, this.style]}>
                <TouchableOpacity onPress={this.disabled ? null : this.action} activeOpacity={this.disabled ? 0.5 : 1}>
                    <View style={[{
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        margin: vars.spacing.medium.mini2x
                    }, this.innerStyle]}>
                        {icons.plainWhite(this.icon)}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
