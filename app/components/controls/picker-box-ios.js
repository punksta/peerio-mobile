import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import icons from '../helpers/icons';

export default class PickerBoxIos extends SafeComponent {
    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
        this.picker = this.props.picker;
    }

    focus() {
        if (uiState.pickerVisible) {
            uiState.hidePicker();
            return;
        }
        uiState.showPicker(this.picker);
    }

    renderThrow() {
        const focused = uiState.pickerVisible && uiState.picker === this.picker;
        const { shadow, background, textview, container, iconContainer, icon } =
            focused ? this.props.style.active : this.props.style.normal;
        return (
            <View style={shadow}>
                <View
                    style={background}>
                    <TouchableOpacity testID="pickerBox" onPress={this.focus}>
                        <View
                            pointerEvents="none"
                            style={container}>
                            <Text style={textview}>
                                {this.props.data[this.props.value]}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View
                        pointerEvents="none"
                        style={iconContainer}>
                        {focused ?
                        icons.dark('arrow-drop-down', () => {}, icon) :
                        icons.white('arrow-drop-down', () => {}, icon)}
                    </View>
                </View>
            </View>
        );
    }
}

PickerBoxIos.propTypes = {
    value: React.PropTypes.any.isRequired,
    picker: React.PropTypes.any.isRequired,
    data: React.PropTypes.any.isRequired,
    style: React.PropTypes.any.isRequired,
    hint: React.PropTypes.any.isRequired
};
