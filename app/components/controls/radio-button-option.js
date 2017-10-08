import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Circle from './radio-button-circle';

export default class Option extends SafeComponent {
    render() {
        const { onPress, isSelected, children } = this.props;

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                    <Circle isSelected={isSelected} />
                    <View style={{ flex: 1 }}>
                        {children}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

Option.propTypes = {
    onPress: React.PropTypes.func,
    isSelected: React.PropTypes.bool
};
