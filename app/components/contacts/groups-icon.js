import React from 'react';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import { tx } from '../utils/translator';

export default class GroupsIcon extends SafeComponent {
    renderThrow() {
        return (
            <View style={{ marginRight: -30 }}>
                {buttons.uppercaseWhiteButton(
                    tx('title_contactGroups'),
                    this.props.action)}
            </View>
        );
    }
}
