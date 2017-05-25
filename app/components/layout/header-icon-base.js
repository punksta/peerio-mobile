import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import routerMain from '../routes/router-main';

export default class HeaderIconBase extends SafeComponent {
    icon = '';
    action = () => { };

    renderThrow() {
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
