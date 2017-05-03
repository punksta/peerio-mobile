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
    action = () => { };

    render() {
        return (
            <View style={{ flex: 0, borderWidth: 0, borderColor: 'red' }}>
                <TouchableOpacity onPress={this.action}>
                    <View style={{
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        margin: 16
                    }}>
                        {icons.plainWhite(this.icon)}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
