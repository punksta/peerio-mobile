import React from 'react';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import { tx } from '../utils/translator';

export default class DoneIcon extends SafeComponent {
    renderThrow() {
        return (
            <View style={{ marginRight: -12 }}>
                {buttons.uppercaseWhiteButton(
                    tx('button_done'),
                    this.props.action)}
            </View>
        );
    }
}
