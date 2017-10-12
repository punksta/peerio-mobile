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

    renderThrow() {
        return (
            <View style={[{ flex: 0 }, this.style]}>
                <TouchableOpacity onPress={this.action}>
                    <View style={[{
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        margin: vars.spacing.large
                    }, this.innerStyle]}>
                        {icons.plainWhite(this.icon)}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
