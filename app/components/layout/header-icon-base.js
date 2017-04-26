import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import routerMain from '../routes/router-main';

@observer
export default class HeaderIconBase extends Component {
    icon = '';
    action = () => {};

    render() {
        return (
            <TouchableOpacity onPress={this.action}>
                <View style={{
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginRight: 16,
                    width: 56,
                    height: 56
                }}>
                    {icons.plainWhite(this.icon)}
                </View>
            </TouchableOpacity>
        );
    }
}
